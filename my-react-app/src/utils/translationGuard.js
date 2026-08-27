/**
 * Survive in-page translation.
 *
 * THE CRASH THIS FIXES
 *
 *   NotFoundError: Failed to execute 'removeChild' on 'Node':
 *   The node to be removed is not a child of this node.
 *
 * Reported four times in three weeks, always the same profile: an anonymous
 * visitor, on `/`, on a mobile browser. It took down the whole landing page —
 * the error escaped to RouteErrorBoundary, which is the last thing a first-time
 * visitor arriving from search should ever see.
 *
 * WHY IT HAPPENS
 *
 * Chrome's built-in translator (and Google Translate, and several in-app
 * browsers) rewrites the page after React has rendered it: it takes a text node
 * and replaces it with a <font> element wrapping the translated text. React
 * knows nothing about that. When React later updates and tries to remove the
 * ORIGINAL text node, that node is no longer a child of the parent React
 * remembers — so removeChild throws, mid-commit, and React unmounts the tree.
 *
 * This site is Arabic-first with an English toggle, so it is precisely the kind
 * of page a browser offers to translate, and the offer is often accepted
 * automatically on mobile.
 *
 * THE FIX
 *
 * Make the two DOM mutations React relies on tolerant of a node the translator
 * already moved. If the node is not where React expects, the removal it wanted
 * has effectively already happened — so return quietly instead of throwing.
 * React's next render reconciles from its own virtual tree and repairs the DOM.
 *
 * This is deliberately narrow: it only softens the exact mismatch that
 * translation creates, and only for `removeChild`/`insertBefore`. Every other
 * DOM error still throws normally.
 *
 * WHY NOT JUST DISABLE TRANSLATION
 *
 * A `notranslate` on <html> would also stop the crash, and would be one line.
 * But students read this site in Arabic, English, Urdu and Hindi, and the
 * built-in translator is how several of them do it. Breaking that to avoid a
 * DOM race is the wrong trade.
 */

let installed = false;

export function installTranslationGuard() {
    if (typeof window === 'undefined' || installed) return;
    if (typeof Node === 'undefined' || !Node.prototype) return;
    installed = true;

    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function removeChild(child) {
        // `instanceof Node` keeps the short-circuit to the case it is for. Without
        // it, passing a non-Node (a genuine programming mistake) would be silently
        // accepted here instead of throwing the TypeError it should.
        if (child instanceof Node && child.parentNode !== this) {
            // The translator re-parented it. React wanted it gone; it is gone
            // from here. Hand the node back, which is what removeChild returns
            // on success, so callers that chain on the result still work.
            return child;
        }
        return originalRemoveChild.apply(this, arguments);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function insertBefore(newNode, referenceNode) {
        if (referenceNode instanceof Node && referenceNode.parentNode !== this) {
            // Same mismatch, other direction: React is inserting relative to a
            // sibling the translator moved. Append instead of throwing — the
            // position may be briefly wrong, and the next render corrects it.
            return originalInsertBefore.call(this, newNode, null);
        }
        return originalInsertBefore.apply(this, arguments);
    };
}

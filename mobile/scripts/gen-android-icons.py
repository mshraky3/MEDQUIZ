"""Regenerates the Android adaptive-icon layers from assets/icon.png. Run from mobile/assets:
    python ../scripts/gen-android-icons.py
Needs Pillow and numpy. Logo is keyed off the navy background and fitted to the 66dp safe zone."""
import math, sys
from PIL import Image, ImageDraw
import numpy as np
BG=np.array([11,16,33],float)
N=1024
im=np.array(Image.open('icon.png').convert('RGBA')).astype(float)
rgb=im[...,:3]
d=np.sqrt(((rgb-BG)**2).sum(-1))
a=np.clip(d/70.0,0,1)
a[766:,:]=0                      # stray speck under the logo
# un-matte: pixel = a*fg + (1-a)*bg
with np.errstate(divide='ignore',invalid='ignore'):
    fg=np.where(a[...,None]>0,(rgb-(1-a[...,None])*BG)/a[...,None],0)
fg=np.clip(fg,0,255)
am=np.clip(d/40.0,0,1); am[766:,:]=0     # monochrome: thicker alpha so thin strokes survive
ys,xs=np.nonzero(a>0.3)
cx=(xs.min()+xs.max())/2; cy=(ys.min()+ys.max())/2
rmax=np.sqrt((xs-cx)**2+(ys-cy)**2).max()
SAFE_R=N*(66/108)/2           # Android safe zone: 66dp circle in a 108dp canvas
s=SAFE_R/rmax
print('centre',cx,cy,'rmax',rmax,'scale',round(s,3),'logo px',round((xs.max()-xs.min())*s))
def place(arr_rgba):
    src=Image.fromarray(arr_rgba.astype(np.uint8),'RGBA')
    w=round(N*s); sc=src.resize((w,w),Image.LANCZOS)
    out=Image.new('RGBA',(N,N),(0,0,0,0))
    off=(round(N/2-cx*s),round(N/2-cy*s))
    out.paste(sc,off,sc)
    return out
fgimg=np.dstack([fg,a*255]); place(fgimg).save('android-icon-foreground.png')
mono=np.dstack([np.full_like(a,255)]*3+[am*255]); place(mono).save('android-icon-monochrome.png')
# splash: same look as before (logo on navy) but 512px instead of 200px
Image.open('icon.png').convert('RGBA').resize((512,512),Image.LANCZOS).save('splash-icon.png')

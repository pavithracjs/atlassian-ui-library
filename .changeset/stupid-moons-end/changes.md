ED-6216: Media externals will be uploaded to the media services when possible
On paste of external images, the media upload API is called to check whether the image can be uploaded to media services. 
If the upload fails, we fallback to external media. 
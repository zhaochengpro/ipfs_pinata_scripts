# Install
  install dependency
  ```javascript
   npm i
  ```
# First step
  You should store your images on multi-files if you want to upload images to ipfs. e.i. Make a directory and rename it as xxx. Then store 20 images in the xxx
  directory. Then Make another directory and store 20 images. and so on.
  ## modify keys.json
   ```javascript
   {
    "API_Key": "xxxxx", // replace your pinata API_Key
    "API_Secret": "xxxxx", // replace your pinata API_Secret
    "JWT": "xxx.xxx.xxx" // replace your pinata JWT
   }
   ```
# Second step
  Input `npm run ipfs [image_diractory] [uploaded image amount] [metadata_output_diractory] file` on your terminal, it will generate corresponding
  metadata file.
# Third step
  Input `npm run ipfs [metadata_diractory] dir` on your terminal. wait a moument. 

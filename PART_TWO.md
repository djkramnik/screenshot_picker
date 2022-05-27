## Assignment 2

### Acceptance Criteria

#### Backend requirement
* 3 endpoints (GET, POST, DELETE) to read/add/remove filepaths under $SCREENSHOT_ROOT from a string json array in a local file `${process.env.SCREENSHOT_ROOT/delete.json`
* 3 endpoints (GET, POST, DELETE) to read/add/remove filepaths under $SCREENSHOT_ROOT from a string json array in a local file `${process.env.SCREENSHOT_ROOT/upload.json`
* node script to upload all file paths in upload.json that are within $SCREENSHOT_ROOT to amazon s3 and then optionally delete them on local fs if upload succeeds (add aws-sdk to package.json dependencies)
* node script to delete all file paths in delete.json that are within $SCREENSHOT_ROOT
* serve a next.js based website described below

#### Frontend requirement

* simple web site, using next.js react framework, that will have the following routes
* on the root path (i.e. localhost:3000) redirect to `/directory`
* on `/directory`, call `GET /api/fs/directory` and then from the array response create a list of links to
`/directory/:directoryName`
* on `/directory/:directoryName` call `GET /api/fs/directory/:directoryName/files?ext=png` and from the list of filepaths
create a list of components: 
  * each component will be comprised of an `img` tag with its href attribute being the path to the png file (as per the query param filter used in the api request).
  * below the `img` tag there should be two square icon buttons side by side, with thumbs up and thumbs down respectively
  * clicking thumbs up should add the file to the upload.json via the api request, and remove it from delete
  * clicking thumbs down should add the file to the delete.json via the api request, and remove it from upload
  * if the png shown is in delete.json, have some kind of muted red border    
  * if the png shown is in upload.json, have soem kind of muted green border
  * use boxshadow to give these components a card like feel

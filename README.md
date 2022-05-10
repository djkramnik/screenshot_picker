## File System Crawler

### Acceptance Criteria:

* an express web server hosted on port 3000
* two endpoints that accept and respond with json

### Endpoints

#### GET `/api/fs/directory`
if `process.env.ROOT_DIR` is set to `/c/User/david/workspace`, and the directores
in that location were 'button', 'img', 'a', then this should return 200 status response with a body of 
```
{
  "directory": ["button", "img", "a"]
}
```
If `process.env.ROOT_DIR` is not set, return the directories in the current working directory, `process.cwd()`

#### GET `/api/fs/directory/${directoryId}/files?ext=`

the dynamic `${directoryId}` is one of the directories returned by 
`/api/fs/directory`.  If an invalid directory is passed, return a 404 status
with empty response body.  Otherwise return a 200 status response with a body of
```
{
  "files": [...]
}
```
support a query param filter ext that if passed filters the files to those
with the ext



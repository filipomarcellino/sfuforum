Live App: sfure.vercell.app

Features are identical to that of reddit:
1. user login/signup authentication
2. create community
3. join/leave community
4. community page (all posts inside a community)
5. create/delete post
6. create/delete comment
7. upvote/downvote post
8. home feed (posts from all of the user's joined communities)

p.s. only emails ending in @sfu.ca can be successfully authenticated to use the application.

There are 4 collections in the database:
1. users
2. posts
3. communities
4. comments
Each modeled with primary key and a foreign key to establish correct relationships between the different collections.

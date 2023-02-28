Live App: http://sfuforum.vercel.app

SFU Student Forum is a web-based discussion platform designed for Simon Fraser University students to communicate and collaborate on course assignments, projects, and general course-related topics. The platform aims to facilitate a supportive and engaging learning environment for SFU students by enabling them to ask questions, share ideas, and connect with their peers. This idea is inspired by Reddit.

This was initially a hackathon project for SFU's mountain madness event (2023). Our team consists of me, Brian Rahadi, and Albert Tan. The project was incomplete due to the hackathon time constraints. I took the initiative to complete this project on my free time post-hackathon.

Features:
1. user login/signup authentication
2. create class
3. join/leave class
4. class page (all posts inside a class)
5. create/delete post
6. create/delete comment
7. upvote/downvote post
8. home feed (posts from all of the user's joined classes)

There are 4 collections in the database:
1. users
2. posts
3. communities
4. comments
Each modeled with primary key and a foreign key to establish correct relationships between the different collections.

Tech stack:
Next.js, firebase, Chakra UI, Recoil

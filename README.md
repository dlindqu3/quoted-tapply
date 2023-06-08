## run app 
- npm run dev


## entry point
- app/page.js 


## sample user
- email: batman@gmail.com
- pass: Green@55


## tasks 
- create global user context DONE 
- set global user context on login DONE 
- create default profile page DONE 
- responsive size for profile page image DONE   
- create/add to users collection on register DONE 
- profile page: update username/email DONE 
- profile page: update photoURL DONE 
- profile page: update favoriteQuote DONE 
- header: logout button DONE 
- header: routes DONE 
- update profile data on form submit DONE
- create quotes DONE 
- read all quotes DONE 
- protected routes (profile, quotes) DONE 
- display user's quotes on profile DONE 
- delete user's quotes on profile DONE 
- update user's quotes on profile DONE 
- fix reroutes on quotes, profile 
- fix profile image on quotes page 

## problem/solution example
- updating collection documents
- old/faulty docs: [link](https://cloud.google.com/firestore/docs/samples/firestore-data-set-field)
- new/working docs: [link](https://firebase.google.com/docs/firestore/manage-data/add-data#update-data)


## problem/solution example
- page not changing when data changed in database (updateDoc) 
- solution: use setState() directly, like with setUserQuote in app/profile/page.js


## problem/solution example
- getDocs returns a snapshot with a .docs property 
- I can iterate over this .docs array and call .docs[i].data() to see the object 
- problem: however, this object does not include an id
- solution: { ...currentDoc.data(), id: currentDoc.id };


## problem/solution example 
- problem: protected routes redirect to login before accessing user context 


## amazon css color scheme 
- #ff9900, #146eb4, #000000, #232f3e, #f2f2f2

## citations 
1. Smoljames, "Learn Next.js by building a full-stack CRUD app | Nextjs + Firebase (Auth & Firestore) + TailwindCSS" [link](https://www.youtube.com/watch?v=UzMr7-0FgA0)
2. developedbyed, "Next.js 13 Crash Course | Learn How To Build Full Stack Apps!" [link](https://www.youtube.com/watch?v=T63nY70eZF0)
3. Spruce Emmanuel, "How to Build a Full Stack App with Next.js 13 and Firebase" [link](https://www.freecodecamp.org/news/create-full-stack-app-with-nextjs13-and-firebase/)
4. Daniel, "Using React Context in NextJs 13" [link](https://www.js-craft.io/blog/using-react-context-nextjs-13/)
5. Stack Overflow, "responsive sizing images next.js with tailwind", [link](https://stackoverflow.com/questions/76396702/responsive-sizing-images-next-js-with-tailwind/76398120#76398120)
6. The Net Ninja, "Firebase Auth Tutorial #15- Firestore Users Collection" [link](https://www.youtube.com/watch?v=qWy9ylc3f9U)
7. Lama Dev, "React Firebase Tutorial | AUTH - CRUD - Image Upload" [link](https://www.youtube.com/watch?v=D9W7AFeJ3kk)
8. PedroTech, "Upload Images / Files to Firebase In React - Firebase V9 File Upload Tutorial" [link](https://www.youtube.com/watch?v=YOAeBSCkArA)
9. Stack Overflow, "Is there a way to use the orderBy() function from firestore using getDocs?" [link](https://stackoverflow.com/questions/70553624/is-there-a-way-to-use-the-orderby-function-from-firestore-using-getdocs)
10. Color-hex, "Amazon-website Color Palette" [link](https://www.color-hex.com/color-palette/26593)
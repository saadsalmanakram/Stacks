{/* You can use a fragment in two  ways*/}

{/*1. Using React.Fragment> */}

return (
  <React.Fragment>
    <h1>Title</h1>
    <p>Description</p>
  </React.Fragment>
);

{/*2. Using shorthand <> */}

return (
  <>
    <h1>Title</h1>
    <p>Description</p>
  </>
);


{/* 
Key Points:

 - No extra DOM node: Fragments don't create an additional DOM element like a <div>, keeping the structure cleaner.

 - Key attribute: Fragments can also take a key attribute, which is useful when rendering lists of elements:
*/}

{/*
Why use Fragments?

 - Cleaner HTML structure: Avoids unnecessary div wrappers or other HTML tags.

 - Performance: Reduces the number of DOM nodes, which can improve performance, especially in large applications.

*/}
# Hooks

Hooks are closures that you can pass to specific types of object so that you
can modify the behavior of how to handle specific objects with an interface
that is friendly to users who want to access it.

Creating a hook should be as simple as this:

1. Create a new Hook in the settings (which should be synced on server
   storage)
2. Input code
3. Should be applied immediately :3

Here's an example of what a hook would look like for adding a message event
for example:
```js
// name: Hide Cherry's messages
// description: holy fuck they are annoying
(function(message) {
    // if a message is marked as deleted, it will not be rendered on the
    // frontend 
    if (message.createUser.username === "cherry")
        message.deleted = true;
})
```

There are two types of hooks that are stored in the settings:

1. Prehooks
2. Posthooks

There isn't any significant about them except they will usually happen
before and after a specified event. For example, **Comment** hooks will
have a hooks for *before* and *after* rendering to an HTML element. (i.e. going
through the 12y parser and creating a DOM tree)

The benefit of these hooks too, with how they are implemented, is that I can
easily add patches if features become important enough.

**Note that things like rendering the page structure will never be affected by
hooks and things as low-level as that will likely never be supported by Hooks
because it is against my interests. I would recommend looking into custom CSS
for that.**
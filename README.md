**Objective:** The objective of this challenge is not necessarily just to solve the problem - but to
evaluate your software development skills, code quality, creativity, and resourcefulness as a
potential future colleague. Please share the necessary artifacts you would provide to your
colleagues in a real-world professional setting.

We have a simple API that returns a JSON array. We would like you to use HTML, CSS and
Javascript to read the API and display it in an organized way. In addition, you should add in
some sort of sorting mechanic to the front-end. Use preferably Vue.js as base and feel free to
add any other framework or library you would consider necessary to achieve the task.

https://swapi.dev/documentation

Feel free to use any data - but perhaps you can use the “planet” resource here.

There is no right answer - just looking for an understanding of how you interpret the assignment
and what decisions you make to build a simple project.

After finishing your code answer the following questions:

1. What's a closure? Where in the code is there a closure?

- A closure is a function that has access to the variables of the enclosing scope, even after the enclosing scope has returned.

  Here's a snippet of code from this project:

  ```js
  const fetchFilms = async (urls: string[]) => {
    setIsFetching(cv => ({ ...cv, films: true }))
    for (const url of urls) {
      ç
      if (!films[url]) {
        const result = await axios.get(url)
        setFilms(cf => ({ ...cf, [url]: result.data }))
      }
    }
    setIsFetching(cv => ({ ...cv, films: false }))
  }
  ```

  In this code, `fetchFilms` function has 3 closures:

  1. The first one is created in the first `setIsFetching` call:\
     `setIsFetching(cv => ({ ...cv, films: true }))`\
     The arrow function captures the `cv` variable from its outer scope, and this creates a closure.

  2. The second one is created in the `setFilms` call:\
     `setFilms(cf => ({ ...cf, [url]: result.data }))`\
     The arrow function captures the `cf`, `url` and `result` variables from its outer scope.

  3. The last one is created in the second `setIsFetching` call:\
     `setIsFetching(cv => ({ ...cv, films: true }))`\
     The arrow function captures the `cv` variable from its outer scope.

2. Which are the potential side-effects in any function? Could you point out any of these cases in
   your code? Are they expected? Can they be avoided?

- Side-effects are any changes that a function makes beyond its primary job of returning a result.\
  Functions with no side-effects are often called "pure" functions, because they always return the same result given the same inputs.

  Potential side-effects:

  - Changing the values of variables outside the function
  - Modifying the values of the arguments passed to the function
  - Making HTTP requests or interacting with external APIs
  - Reading or writing to files
  - Changing the structure or content of the DOM
  - Throwing exceptions

  Here's a snippet of code from this project:

  ```js
  const fetchPlanets = async () => {
    // Reset 'data' state
    setData(null)

    // Fetch from API and store data on 'data' state
    const result = await axios.get('https://swapi.dev/api/planets', {
      params: {
        search: searchParams.get('search') ?? '',
        page: searchParams.get('page') ?? '',
      },
    })
    setData(result.data)
  }
  ```

  This code involves an async function `fetchPlanets`, which has some potential side-effects:

  1. **State modification:**\
     The function modifies the state of `data` to null initially and then updates it with the fetched data later. This is a side-effect because it changes the state of the application.

  2. **Async behaviour:**\
     The function is async meaning it won't complete inmediately. Async behaviour can produce side-effects, especially when dealing with state that might rely on the completion of this operation.

  3. **Network Interaction:**\
     The function makes an HTTP request to an external API. Network interactions are cosidered side-effects because they involve communication with an external system.

  These side-effects are expected because the function is designed to do what it's doing, fetch data from an API and update the state accordingly which are both necessary in this context.\
  They cannot be avoided entirely, although the function could include a `try catch` block. However, due to the simplicity of this project and the small amount of parameters passed in the request I don't consider it necessary.

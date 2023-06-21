import * as model from './model';
import RecipeView from './views/recipeView';
import SearchView from './views/searchView';
import ResultsView from './views/resultsView';
import PaginationView from './views/paginationView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render Spinner before loading
    RecipeView.renderSpinner();

    // 1.) Loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2.) Rendering recipe
    RecipeView.render(recipe);
  } catch (err) {
    RecipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Render Spinner before loading
    ResultsView.renderSpinner();

    // 1.) Get search query
    const query = SearchView.getQuery();
    if (!query) return;

    // 2.) Load search results
    await model.loadSearchResults(query);

    // 3.) Render results
    ResultsView.render(model.getSearchResultsPage());

    // 4.) Render initial pagintaion buttons
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3.) Render NEW results
  ResultsView.render(model.getSearchResultsPage(goToPage));

  // 4.) Render NEW pagintaion buttons
  PaginationView.render(model.state.search);
};

const init = function () {
  RecipeView.addHandlerRender(controlRecipes);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
};
init();

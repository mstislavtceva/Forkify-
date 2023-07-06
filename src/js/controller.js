import * as model from './model';
import RecipeView from './views/recipeView';
import SearchView from './views/searchView';
import ResultsView from './views/resultsView';
import PaginationView from './views/paginationView';
import BookmarksView from './views/bookmarksView';
import AddRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

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

    // 0.) Update results view to mark selected search result
    ResultsView.update(model.getSearchResultsPage());
    // Update bookmarks view
    BookmarksView.update(model.state.bookmarks);

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

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // RecipeView.render(model.state.recipe);
  RecipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1.) Add/remove bookmrk
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2.) Update recipe view
  RecipeView.update(model.state.recipe);

  // Render bookmarks
  BookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Display loading spinner
    AddRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    RecipeView.render(model.state.recipe);

    // Display success message
    AddRecipeView.renderMessage();

    // Render bookmark view
    BookmarksView.render(model.state.bookmarks);

    // Change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      AddRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('😋', err);
    AddRecipeView.renderError(err.message);
  }
};

const init = function () {
  BookmarksView.addHandlerRender(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  AddRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

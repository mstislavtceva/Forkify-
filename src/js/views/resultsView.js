import icons from 'url:../../img/icons.svg';
import View from './view';
import PreviewView from './previewView';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _successMessage =
    'Start by searching for a recipe or an ingredient. Have fun!';

  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new ResultsView();

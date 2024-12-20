export default class TermSet {
  constructor(data=null) {
    // Create the blank term set attributes
    this.uuid = crypto.randomUUID();
    this.title = '';
    this.subject = '';
    this.settings = {};
    this.terms = [];

    // If there is data to load
    if (data !== null) {
      return this.load(data);
    }
  }

  /**
   * Adds a term to the term list
   * @param {string} term The term to memorize
   * @param {string} definition The definition of the term
   */
  addTerm(term, definition) {
    this.terms.push({
      term, definition
    });
  }

  /**
   * Retrieves the next term for studying
   * @param {boolean} randomOrder Whether to get the next term randomly
   * @returns The next term
   */
  getNextTerm(randomOrder=false) {
    // If there is not already an available terms list
    if (!this.availableTerms) {
      this.availableTerms = this.terms;
    }

    // If there are no more available terms
    if (this.availableTerms.length <= 0) {
      return null;
    }

    if (randomOrder) {
      return this.availableTerms.splice(Math.floor(Math.random() * this.availableTerms.length), 1)[0];
    }

    // Otherwise, return the first term
    return this.availableTerms.splice(0, 1)[0];
  }

  load(data) {
    let termsData;
    // If the data is a string
    if (typeof data === 'string') {
      try {
        // Parse it directly as JSON
        termsData = JSON.parse(data);
      } catch (e0) {
        // If that fails, try to load it via URI decoding
        try {
          termsData = JSON.parse(decodeURIComponent(data));
        } catch (e) {
          // If that fails, print an error and abort
          throw new Error('Invalid term data.');
          // return;
        }
      }
    }
    // Otherwise, the data is an object
    else {
      termsData = data;
    }

    // Extract the basic attributes from the term data
    this.uuid = termsData.uuid;
    this.title = termsData.title;
    this.subject = termsData.subject;
    this.settings = termsData.settings;
    this.terms = termsData.terms;

    // If the term UUID is invalid, throw an error
    if (typeof this.uuid !== 'string' || this.uuid.length < 36) {
      throw new Error('Unable to load term data.');
    }
  }
}
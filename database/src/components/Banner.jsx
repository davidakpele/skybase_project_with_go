import "./Banner.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import lnstitution_logo from "../assets/images/logo.png"
import { Link } from 'react-router-dom';
import React, { useState, useEffect, lazy, Suspense, useRef  } from 'react';
import ApiService from "../service/ApiService"

const SearchDataResult = lazy(() => import('./SearchDataResult'));

const Banner = () => {
  const [noResults, setNoResults] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isFound, setIsFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [query, setQuery] = useState({"search": "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileVisibility, setMobileVisibility] = useState(false);
  const [items, setItems] = useState([]); 
  const hasFetched = useRef(false);

  const [results, setResults] = useState({
    bookshelves: [],
    journals: [],
    subjects: [],
  });
  
  useEffect(() => {
    document.title = 'University of Cambridge';
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchSubcribedPackageList();
    }
  }, []);

  const handleSearchRequest = async (e) => {
    const searchQueryData = e.target.value;
    setIsFound(false)
    setQuery({
      ...query,
      [e.target.name]: searchQueryData,
    });

    setSearchQuery(searchQueryData);

    if (!searchQueryData.trim()) {
      setIsEmpty(true)
      setNoResults(false);
      setIsLoading(false);
      return;
    }
    setIsEmpty(false)
    setIsLoading(true);
    try {
      setTimeout(() => {
        forwaredSearchRequest(searchQueryData);
      }, 500); 
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsFound(false)
      setNoResults(true); 
    }
  };

  const forwaredSearchRequest = (searchQueryData) => {
    ApiService.SearchData(searchQueryData)
      .then((result) => {
        if (result.data.data.bookshelves.length == 0 &&
          result.data.data.subjects.length == 0 &&
          result.data.data.journals.length == 0) {
          setIsFound(false)
          setNoResults(true);
          setIsLoading(false);
          setMobileVisibility(false)
        } else {
          setIsFound(true);
          setResults(result.data.data);
          setNoResults(false);
          setIsLoading(false);
          setMobileVisibility(true)
        }
      })
  }

  const handleClearSearch = () => {
    setQuery({
      ...query,
      'search':''
    });

    setResults({
      ...results,
      bookshelves: [],
      journals: [],
      subjects: [],
    });
    setIsLoading(false);
    setIsEmpty(true);
    setIsFound(false);
    setMobileVisibility(false);
  }

  const fetchSubcribedPackageList =async () => {
    ApiService.FetchSubjectList()
      .then((result) => {
          if (result.data._items && result.data._items.length > 0) {
            setTimeout(() => {
              setIsHidden(true);
              setItems(result.data._items);
            }, 1000);
          } else {
            setItems([]); 
            setIsHidden(false);
          }
        })
  }

  const filterByJournalsOnly = async () => {
    const searchQueryData = query.search;
    ApiService.FilterOnlyByJournals(searchQueryData)
      .then((result) => {
        if (result.data.data.bookshelves.length == 0 && result.data.data.subjects.length == 0  && result.data.data.journals.length == 0) {
          setIsFound(false)
          setNoResults(true);
          setIsLoading(false);
          setMobileVisibility(false)
        } else {
          setIsFound(true)
          setResults(result.data.data);
          setNoResults(false);
          setIsLoading(false);
          setMobileVisibility(true)
        }
      })
  }

  const filterBySubjectsOnly = async () => {
    
    const searchQueryData = query.search;
    ApiService.FilterOnlyBySubjects(searchQueryData)
      .then((result) => {
        if (result.data.data.bookshelves.length == 0 && result.data.data.subjects.length == 0  && result.data.data.journals.length == 0) {
          setIsFound(false)
          setNoResults(true);
          setIsLoading(false);
          setMobileVisibility(false)
        } else {
          setResults([])
          setIsFound(true)
          setResults(result.data.data);
          setNoResults(false);
          setIsLoading(false);
          setMobileVisibility(true);
        }
      })
  }  
  
  const filterByAllResults = async () => {
    const searchQueryData = query.search;
    forwaredSearchRequest(searchQueryData);
  }

  return (
    <>
      
      <div className="media-desktop locale-en-us" id="locale-en-us">
        <div className="canvas">
          <div id="library-content" className="container ">
            <div id="ember620" className="splash-panel __f1079 hide-header ember-view">
              <div className="content" id="o_cok_pl">
                <div className="subjects-container">
                  <ul className="responsive-menu"></ul>
                  <div id="ember625" className="__fbe9a ember-view">
                    <div>
                      <div id="ember626" className="ember-view institute_logo">
                        <h3 className="subjects-library-attribution">Access Provided To</h3>
                          <h1 className="library-logo has-name">
                            <img src={lnstitution_logo} alt=""/>
                          </h1>
                      </div>
                    </div>
                  </div>
                  <div className="subjects-search-container clone_result">
                    <h3 className="subjects-search-sub-head">
                      Find Journal or eBooks By Title, Subject, or ISSN
                    </h3>
                    <div id="ember637" className="search-pane-container __bd7a3 subjects ember-view">
                      <ul role="dialog" className="search-pane complete">
                        <li className="search-field-container">
                          <div id="ember644" className="search-field __991a0 ember-view">
                            <input
                              aria-label="Find Journal By Title, Subject, or ISSN"
                              type="text"
                              autoComplete="off"
                              title="Find Journal By Title, Subject, or ISSN"
                              id="ember650"
                              name="search"
                              value={query.search} onChange={handleSearchRequest}
                              className="hero-search ember-text-field ember-view input_banner_search_master"
                            />
                            {!isLoading && isEmpty  && (<FontAwesomeIcon icon={faSearch}  />)}
                            {!isLoading && !isEmpty && <FontAwesomeIcon icon={faXmarkCircle} onClick={handleClearSearch} />}
                            {isLoading && (
                              <div id="ember1178" className="__0d2b3 ember-view" style={{ display: "block" }}>
                              <div className="spinner align-right">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                              </div>
                            </div>
                            )}
                              
                           
                          </div>
                        </li>
                        <div id="search_result">

                        {noResults && (
                          <div className="error-search">
                            <li
                              tabIndex="0"
                              className="no-results-container in-progress"
                              style={{ display: 'block' }}
                            >
                              <span className="label">
                                No matches for <span id="noFoundString">“{searchQuery}”</span>. Title may not be SkyBase Data Center enabled at this time, but still available at your library.
                                <br />
                                <a
                                  tabIndex="0"
                                  href="javascript:void(0)"
                                  target="_new"
                                >
                                  Please click here to search for your title again at your library
                                </a>
                              </span>
                            </li>
                          </div>
                        )}

                          {isFound && (
                            <>
                            <Suspense>
                            <SearchDataResult
                                data={results}
                                filterBySubjectsOnly={filterBySubjectsOnly}
                                filterByAllResults={filterByAllResults}
                                filterByJournalsOnly={filterByJournalsOnly}
                              />
                            </Suspense>
                            </>
                           
                          )}
                        </div>
                      </ul>
                      <ul className="responsive-menu"></ul>
                    </div>
                  </div>
                  <div className="subjects-search-placeholder"></div>
                  <div
                    id="ember651"
                    className="search-pane-container __bd7a3 subjects ember-view"
                  >
                    <ul role="dialog" className="search-pane">
                      <li
                        className="exit"
                        data-ember-action=""
                        data-ember-action-652="652"
                      ></li>
                    </ul>
                    <ul className="responsive-menu"></ul>
                  </div>
                  <div className="subject-holder " id="subj_holder">
                    <h3 tabIndex="0" className="subjects-sub-head" id="browser_hf">
                      Browse Subjects
                    </h3>
                    <div style={{ display: !isHidden ? "block" : "none" }}>
                      <div id="ember1952" className="__0d2b3 ember-view">
                           <div className="spinner align-center">
                              <div className="bounce1"></div>
                              <div className="bounce2"></div>
                              <div className="bounce3"></div>
                          </div>
                      </div>
                    </div>
                      <ul id="subjects-list" className={`${mobileVisibility ? ' mobileVisibility' : ''}`}>
                        {items.map((subject) => (
                          <li key={subject.subjectid}>
                            <div className="ember-view">
                              <Link
                                to={`/library/${subject.package_id}/subjects/${subject.subjectid}/?sort=title&all=1`}
                                relative="path"
                                tabIndex="0"
                                className="subjects-list-subject ember-view">
                                <span className="subjects-list-subject-name">
                                  {subject.subjects_name}
                                </span>
                                <span className="subjects-list-subject-icon flaticon solid files"></span>
                              </Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
              </div>
              <div className="banner" id="banner">
                <div className="shadow-top"></div>
                <div className="shadow-bottom"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}

export default Banner
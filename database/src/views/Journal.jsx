/* eslint-disable react-hooks/exhaustive-deps */
import "./Journal.css"
import Header from './../components/Header';
import SideBarDrawer from '../components/SideBarDrawer';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams} from 'react-router-dom';
import ApiService from "../service/ApiService"
import { useAuth } from '../context/AuthContext';

const Journal = () => {
  const { monitorIssueLogs } = useAuth();
  const { packageId, journalId } = useParams();
  const hasFetched = useRef(false);
  const userHasSelectedIssue = useRef(false);
  const prevSelectedYearId = useRef(null);
  const hasLoadedArticles = useRef(false);

  const [journalIssues, setJournalIssues] = useState([]);
  const [publicationYears, setPublicationYears] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState(null);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [emptyJournalError, setEmptyJournalError] = useState(false);
  const [emptyArticles, setEmptyArticles] = useState(false);
  const [pageLoader, setPageLoader] = useState(true);
  const [showRelated, setShowRelated] = useState(false);
  const [showIssue, setShowIssue] = useState(false);
  // const [loadMoreResource, setLoadMoreResource] = useState(false);
  // const [processLoadMoreResource, setProcessLoadMoreResource] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [articleLoader, setArticleLoader] = useState(false);
  const [activeState, setActiveState] = useState({
    id: '',
    year:''
  })
  const [journalInfor, setJournalInfo] = useState({
    title: '',
    file: ''
  });

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      loadJournalById(journalId);
      loadPublicationYears(journalId);
      loadJournalIssues(journalId, packageId);
    }
  }, [journalId, packageId]);

  const loadJournalById = async (id) => {
    setArticleLoader(true);
    setPageLoader(true);
    try {
      const res = await ApiService.FetchJournalById(id);
      const data = res.data.data?.data;
      if (data?.attributes) {
        setJournalInfo({
          title: data.attributes.title,
          file: data.attributes.file
        });
        document.title = `${data.attributes.title || ''} - University of Cambridge`;
      } else {
        setEmptyJournalError(true)
        document.title = `University of Cambridge`;
      }
    } catch (err) {
      setEmptyJournalError(false)
      setDbError(true)
      console.error("Error fetching journal by ID", err);
    }
  };

  const loadPublicationYears = async (id) => {
    setArticleLoader(true);
    try {
      const result = await ApiService.FetchAllPublicationYear(id);
      const years = result.data.data;
      if (result.data.data && years.length > 0) {
        setPublicationYears(years);
        if (years.length > 0) setSelectedYearId(years[0].id);
      } else {
        setTimeout(() => {
          setGlobalError(true)
          setPageLoader(false);
        }, 2000);
      }
    } catch (err) {
      setDbError(false)
      console.error("Error fetching publication years", err);
    }
  };

  const loadJournalIssues = async (id, packageId) => {
    setArticleLoader(true);
    try {
      const res = await ApiService.HandleFetchAllIssueByJournalId(id, packageId);
      const issues = res.data.data;
      if (res.data.data && issues.length > 0) {
        setTimeout(() => {
          setJournalIssues(issues);
          setPageLoader(false);
        }, 2000);
      } else {
        setTimeout(() => {
          setGlobalError(true)
          setPageLoader(false);
        }, 2000);
      }
      
      
    } catch (err) {
      setDbError(false)
      console.error("Error fetching journal issues", err);
    }
  };

  const filteredIssues = selectedYearId
    ? journalIssues.filter(issue => issue.publicationYearId === selectedYearId)
    : [];

  useEffect(() => {
    if (selectedYearId !== prevSelectedYearId.current) {
      userHasSelectedIssue.current = false;
      prevSelectedYearId.current = selectedYearId;
    }
    if (!userHasSelectedIssue.current && filteredIssues.length > 0) {
      setSelectedIssueId(filteredIssues[0].id);
    }
  }, [filteredIssues, selectedYearId]);

  const handleYearClick = (yearId, year) => {
    setSelectedYearId(yearId);
    setActiveState(({
      ...activeState,
      year:year
    }))
  };

  const handleIssueClick = (issueId) => {
    userHasSelectedIssue.current = true;
    setSelectedIssueId(issueId);
  };

  const loadJournalArticlesByIssueId = async (id) => {
    setArticleLoader(true);
    setEmptyArticles(false)
    try {
      const result = await ApiService.FetchAllArticles(journalId, id, 1);
      if (result.data.data && result.data.data.length > 0) {
        setArticles(result.data.data)
        setTimeout(() => {
          setArticleLoader(false)
          setEmptyArticles(false)
        }, 2000);
      } else {
        setTimeout(() => {
          setArticles([])
          setEmptyArticles(true)
          setArticleLoader(false)
        }, 2000);
      }
      
    } catch (err) {
      setDbError(true)
      setArticleLoader(true)
      setEmptyArticles(false)
      console.error("Error fetching journal by ID", err);
    }
  }

  const activeIssue = journalIssues.find(issue => issue.id === selectedIssueId);

  useEffect(() => {
    if (
      activeIssue) {
      loadJournalArticlesByIssueId(activeIssue.id);
      hasLoadedArticles.current = true;
    }
  }, [activeIssue]);

  // Get the current year object from publicationYears
  const currentYearObj = publicationYears.find(year => year.id === selectedYearId);
  const currentYear = currentYearObj ? currentYearObj.year : '';
  if (currentYear) {
    monitorIssueLogs(activeIssue, "", 0, currentYear, activeIssue, 1);
  }

  const handleToggleIssue = () => {
    if (!showIssue) {
      setShowRelated(false);
      setShowIssue(true);
    } else {
      setShowIssue(false);
    }
  };

  const handleToggleRelated = () => {
    if (!showRelated) {
      setShowIssue(false);
      setShowRelated(true);
    } else {
      setShowRelated(false);
    }
  };
  
  const handleTogglePrevious = () => {
    window.history.back();
  }


  return (
    <>
      {!pageLoader && globalError && (<>
        <div className="error-screen" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100dvh", textAlign: "center", padding: "1rem" }}>
          <div className="error-msg">
            <p>The details of this journal are not complete yet.</p>
          </div>
          <button className={`button ${globalError ? 'primary' : ''}`} id="loadMoreButton" onClick={handleTogglePrevious} style={{ marginTop: "1rem" }}>
            Go Back
          </button>
        </div>
      </>)}
      {pageLoader ? (<>
        <div style={{marginBottom:"60px"}}>
            <div className="bookshelf-loading-indicator" id="loading" >
                <div id="ember1952" className="__0d2b3 ember-view">
                    <div className="spinner align-center"  id="spinnerLoad">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                    </div>
                </div>
            
                <div className="mt-5" style={{marginTop:"15px"}}>
                <button className='button' id="loadMoreButton" style={{ placeItems: "center", display: "grid", margin: "0 auto" }}>
                Loading...
                </button>
                </div>
            </div>
        </div>
      </>) : (<>
          {!globalError && (<>
            <Header />
            <SideBarDrawer />
            <div className="media-desktop locale-en-us content-container" id="mainContent">
              <div className="canvas">
                <div id="library-content" className="container js">
                  <section aria-label="Journal" className="journal-toc">
                    <aside>
                        <section className="journal">
                        <div className="backdrop"></div>
                        <section aria-label="Journal Header" className="rest">
                          <div id="ember1431" className="journal-cover __771d8 ember-view">
                            <div className="image-container">
                              {journalInfor.file && (
                                <img 
                                  src={journalInfor.file} 
                                  alt={journalInfor.title} 
                                  title={journalInfor.title} 
                                />
                              )}

                              <div className="article-meta-data">
                                <h1>{journalInfor.title}</h1>
                              </div>
                              <div className="back-button back" data-ember-action-2413="2413" >
                                <Link to={"/"}><span className="left-2 flaticon stroke"></span>Back to Journals</Link>
                              </div>
                            </div>
                          </div>
                          <h1 className="journal-title">{journalInfor.title}</h1>
                          <button aria-label="Add to my bookshelf" className="my-bookshelf button outline tabIndex">
                            <span className="icon-and-text">
                              <span className="icon flaticon solid plus-2"></span>
                              <span className="label">Add to my bookshelf</span>
                            </span>
                          </button>
                        </section>
                        
                      </section>
                      {/* Controls */}
                      <ul className="controls">
                          <li tabIndex="0" className="back back-button tabIndex" onClick={handleTogglePrevious}>
                            <span aria-hidden="true" className="icon flaticon solid left-2"></span> Back
                          </li>

                          <li tabIndex="0" className={`issues tabIndex ${showIssue ? 'active' : ''}`}  onClick={handleToggleIssue}>
                              Issues <span aria-hidden="true" className="icon flaticon solid down-2"></span>
                          </li>

                          <li tabIndex="0" className={`related tabIndex ${showRelated ? 'active' : ''}`} onClick={handleToggleRelated}>
                            Related <span aria-hidden="true" className="icon flaticon solid down-2"></span>
                          </li>
                        </ul>
                        {showIssue && (
                          <div id="ember1310" className="__fc988 ember-view">
                            <section aria-label="Publication Years" className="years">
                              <ul>
                                {publicationYears.map((yearObj) => (
                                  <div  key={yearObj.id}>
                                    <li tabIndex="0" className={`year ${selectedYearId === yearObj.id ? 'selected' : ''} tabIndex`}
                                      onClick={() => handleYearClick(yearObj.id, yearObj.year)}>{yearObj.year}</li>
                                  </div>
                                
                                ))}
                                  <div id="ember1317" className="all-issues ember-view">          
                                    <li tabIndex="0" className="all-back-issues-link tabIndex">
                                      <a href="https://idiscover.lib.cam.ac.uk/primo-explore/search?query=any,exact,1960-6176,OR&amp;query=any,exact,(),AND&amp;pfilter=pfilter,exact,journals,AND&amp;tab=cam_lib_coll&amp;search_scope=SCOP_CAM_ALL&amp;sortby=rank&amp;vid=44CAM_PROD&amp;mode=advanced&amp;offset=0" target="_blank">
                                          See All
                                        <span className="icon fa fa-external-link"></span>
                                      </a>
                                    </li>
                                  </div> 
                                </ul>
                            </section>
                          
                            <section aria-label="Journal Issues" className="back-issues issues">
                            {filteredIssues.map((issue, index) => (
                                <div id="ember1318" key={index} className={`issue ember-view ${selectedIssueId === issue.id ? 'active-override' : ''}`} onClick={() => handleIssueClick(issue.id)}>
                                <Link to={`/library/${packageId}/journals/${journalId}/issue/${issue.id}`}>
                                      <span className="label">Vol {issue.volume} Issue {issue.issue_number}</span>
                                      <div className="accessories">
                                        <span className="icon arrow flaticon solid right-2"></span>
                                      </div>
                                    </Link>
                                  </div>
                                ))}
                            </section>
                          </div>
                        )}
                        
                        {showRelated && (
                          <div className="browse_mobile_issue">
                              <section aria-label="Browse Related Subjects" className="related-bookshelves">
                                <div id="ember2566" className="ember-view">            
                                  <div className="bookshelf">
                                    <span className="icon flaticon solid files-1"></span>
                                      <a tabIndex="0" title="Film Studies" href="/libraries/603/subjects/57/bookcases/75/bookshelves/207?sort=title" id="ember2567" className="ember-view">                
                                        <span className="label">Film Studies</span>
                                      </a>            
                                    </div>
                                  </div>      
                              </section>
                          </div>
                          
                        )}
                      {/* publication year */}
                      <div id="ember1612" className="__fc988 ember-view sidebar_yearlisting">
                        <section aria-label="Journal Issues" className="back-issues issues ">
                          <div className="header-container">
                            <header tabIndex="0">Journal Issues</header>
                          </div>
                          <div className="back-issue-navigation">
                            <div className="years">
                              {publicationYears.map((yearObj) => (
                                <div
                                  key={yearObj.id}
                                  tabIndex="0"
                                  className={`year ${selectedYearId === yearObj.id ? 'selected' : ''} tabIndex`}
                                  onClick={() => handleYearClick(yearObj.id, yearObj.year)}>
                                  {yearObj.year}
                                  <span className="icon arrow flaticon solid right-2"></span>
                                </div>
                              ))}

                              <div id="ember1495" className="ember-view">
                                <Link to={"/"} target="_blank" className="all-back-issues-link">
                                  See All
                                  <span className="icon fa fa-external-link"></span>
                                </Link>
                              </div>
                            </div>
                            <div className="back-issue-items">
                              {filteredIssues.map((issue, index) => (
                                <div key={index} className={`issue ember-view ${selectedIssueId === issue.id ? 'active-override' : ''}`} onClick={() => handleIssueClick(issue.id)}>
                                  <Link to={`/library/${packageId}/journals/${journalId}/issue/${issue.id}`}>
                                    <span className="label">Vol {issue.volume} Issue {issue.issue_number}</span>
                                    <div className="accessories">
                                      <span className="icon arrow flaticon solid right-2"></span>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        </section>
                      </div>
                      
                          {/* relative journals */}
                      <div className="browse_desktop_issue">
                        <section aria-label="Browse Related Subjects" className="related-bookshelves">
                            <header tabIndex="0">Browse Related Subjects</header>
                            <div id="ember2566" className="ember-view">            
                              <div className="bookshelf">
                                <span className="icon flaticon solid files-1"></span>
                                  <a tabIndex="0" title="Film Studies" href="/libraries/603/subjects/57/bookcases/75/bookshelves/207?sort=title" id="ember2567" className="ember-view">                
                                    <span className="label">Film Studies</span>
                                  </a>            
                                </div>
                              </div>      
                        </section>
                      </div>
                      
                    </aside>


                {/* Articles */}

                    <main>
                      <header id="main-content" className="issue no-unread-articles">
                        <div className="issue-info">
                          {activeIssue ? (
                            <h2 className="title">
                              {currentYear}: Vol. {activeIssue.volume} Issue {activeIssue.issue_number}
                            </h2>
                          ) : (
                            <h2 className="title">No issue selected</h2>
                          )}
                        </div>
                      </header>

                      {!articleLoader && (
                        <div id="ember2078" className="article-list __1c09d ember-view">
                          <div id="ember2079" className="infinite-scroller ember-view">
                            <div id="ember2081" className="article-list-item __6ba9e ember-view">
                              <article aria-label="Du numéro 0 au numéro 100, brève histoire d’un bulletin associatif devenu une revue de référence (1985-2023)" className="652998363   no-unread-articles  ">
                                <table className="article-split-container">
                                  <thead></thead>
                                  <tbody>
                                    {articles.map((article) => (
                                      <tr key={article.id}>
                                        <td className="metadata-container">
                                          <section aria-label={`Metadata for ${article.attributes.title}`} className="article-list-item-content-block">
                                            <div className="title">
                                              <div className="ember-view">
                                                <a 
                                                  target="_blank" 
                                                  tabIndex="0" 
                                                  href={article.attributes.permalink || article.attributes.browzineWebInContextLink}
                                                  className="ember-view"
                                                >
                                                  {article.attributes.title}
                                                </a>
                                              </div>
                                            </div>
                                            <div className="metadata">
                                              <span tabIndex="0" className="pages">
                                                {article.attributes.startPage && article.attributes.endPage 
                                                  ? `pp. ${article.attributes.startPage}-${article.attributes.endPage}`
                                                  : ''}
                                              </span>
                                              <span className="authors">
                                                <span tabIndex="0" className="preview tabIndex">
                                                  {article.attributes.authors}
                                                </span>
                                              </span>
                                            </div>
                                            <div className="content-overflow">
                                              <span className="chevron icon flaticon solid down-2"></span>
                                            </div>
                                            <div className="tools">
                                              <div className="buttons noselect">
                                                <div className="button invisible read-full-text">
                                                  <div className="ember-view">
                                                    <a 
                                                      aria-label="Link to Article" 
                                                      target="_blank" 
                                                      tabIndex="0" 
                                                      href={article.attributes.permalink || article.attributes.browzineWebInContextLink}
                                                      className="tooltip ember-view"
                                                    >
                                                      <span aria-hidden="true" className="icon fal fa-link"></span>
                                                      <span className="aria-hidden">Link to Article - {article.attributes.title}</span>
                                                    </a>
                                                  </div>
                                                </div>
                                                <div className="button invisible add-to-my-articles">
                                                  <a tabIndex="0" aria-label="Save to My Articles" className="tabIndex tooltip">
                                                    <span aria-hidden="true" className="icon fal fa-folder"></span>
                                                    <span className="aria-hidden">Save to My Articles - {article.attributes.title}</span>
                                                  </a>
                                                </div>
                                                <div className="__194b5 ember-view">
                                                  <div className="button invisible citation-services">
                                                    <a tabIndex="0" aria-label="Export Citation" className="tabIndex tooltip">
                                                      <span aria-hidden="true" className="icon fal fa-graduation-cap"></span>
                                                      <span className="aria-hidden">Export Citation - {article.attributes.title}</span>
                                                    </a>
                                                  </div>
                                                </div>
                                                <div className="__194b5 ember-view">
                                                  <div className="button invisible social-media-services">
                                                    <a tabIndex="0" aria-label="Share" className="tabIndex tooltip">
                                                      <span aria-hidden="true" className="icon fal fa-share-alt"></span>
                                                      <span className="aria-hidden">Share - {article.attributes.title}</span>
                                                    </a>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </section>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody> 
                                </table>
                              </article>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div style={{marginBottom:"60px"}}>
                          <div className="bookshelf-loading-indicator" id="loading" style={{ display: articleLoader || emptyJournalError || dbError || emptyArticles ? 'block' : 'none' }}>
                              <div id="ember1952" className="__0d2b3 ember-view">
                                  <div className="spinner align-center" style={{ display: articleLoader ? 'block' : 'none' }} id="spinnerLoad">
                                      <div className="bounce1"></div>
                                      <div className="bounce2"></div>
                                      <div className="bounce3"></div>
                                  </div>
                              </div>
                              <div className="error-screen" style={{textAlign: "center", display: "grid", margin: "0 auto"}}>
                                <div className="message" style={{ display: dbError || emptyArticles ? 'block' : 'none' }}>
                                {emptyArticles ? (
                                      <>
                                        <span>Could not find articles related to this volume</span>
                                        <p>Please choose another volume</p>
                                      </>
                                    ) : dbError ? (
                                      <>
                                        <p>Database error occurred. Please try again later.</p>
                                        <p>Support has been notified.</p>
                                      </>
                                    ) : null}
                                      
                                  </div>
                                  <div className="error-msg" style={{display: emptyJournalError ? 'block': 'none'}}>
                                      <p>No journals found on this or related to this subject.!</p>
                                  </div>
                              </div>
                              <div className="mt-5" style={{marginTop:"15px"}}>
                              <button className={`button ${emptyJournalError || emptyArticles ? 'primary' : ''}`} id="loadMoreButton" style={{ placeItems: "center", display: "grid", margin: "0 auto" }}>
                                {articleLoader
                                  ? 'Loading...'
                                  : emptyJournalError
                                  ? 'Try Again...!'
                                  : emptyArticles
                                  ? 'Try Again'
                                  : dbError
                                  ? 'Error'
                                  : ''}
                              </button>

                              </div>
                          </div>
                      </div>
                    </main>
                  </section>
                </div>
              </div>
            </div>
          </>)}
          </>)}
    </>
  )
}

export default Journal
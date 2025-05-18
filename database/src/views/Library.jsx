import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from './../components/Header';
import SideBarDrawer from '../components/SideBarDrawer';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useSearchParams, useLocation } from 'react-router-dom';
import ApiService from "../service/ApiService"
import { useAuth } from '../context/AuthContext';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Library = () => {
  const { packageId, subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const path = location.pathname;
  const pathParts = location.pathname.split('/');
  const hasAllParam = searchParams.has('all');
 
  const currentURL = window.location.href;
  const url = new URL(currentURL);
  const pathname = url.pathname;

  const pathnameSegments = pathname.slice(1).split('/');
  const libraryPort = pathnameSegments[1];
  const subjectPort = pathnameSegments[3];
  const bookcasesPort = pathnameSegments[5];
  const bookshalvesPort = pathnameSegments[7];
  
  const paramAll1 = pathParts[4] && !pathParts[6] && hasAllParam ? 'active' : '';
  const paramAll2 = pathParts[4] && pathParts[6] && !pathParts[8] ? 'active' : '';
  
  const hasBookcases = path.includes('/bookcases/');
  const bookcaseIndex = pathParts.indexOf('bookcases');
  
  const bookshelfIndex = pathParts.indexOf('bookshelves');
  
  const bookcaseId = bookcaseIndex !== -1 ? pathParts[bookcaseIndex + 1] : null;
  const bookshelfId = bookshelfIndex !== -1 ? pathParts[bookshelfIndex + 1] : null;
 
  const [categoryItemList, setCategoryItemList] = useState([]);
  const [bookcaseItemList, setBookcaseItemList] = useState([]);
  const [journalList, setJournalList] = useState([]);
  const [subject, setSubject] = useState([]);
  const [bookcaseObject, setBookcaseObject] = useState([]);
  const hasFetched = useRef(false);
  const prevBookcaseId = useRef(null);
  const prevBookshelfId = useRef(null);

  const [journalLoader, setJournalLoader] = useState(false);
  const [emptyJournalError, setEmptyJournalError] = useState(false);
  const [loadMoreResource, setLoadMoreResource] = useState(false);
  const [processLoadMoreResource, setProcessLoadMoreResource] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [showSubject, setShowSubject] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const { monitorStation, getStation } = useAuth();

  useEffect(() => {
    const ports = [libraryPort, subjectPort, bookcasesPort, bookshalvesPort];
  
    const hasInvalidNumber = ports.some(
      (val) => val !== undefined && val !== '' && isNaN(val)
    );
  
    if (hasInvalidNumber) {
      window.history.back();
    }
  }, [libraryPort, subjectPort, bookcasesPort, bookshalvesPort]);
  
  useEffect(() => {
      document.title = 'University of Cambridge';
      if (!hasFetched.current) {
        hasFetched.current = true;
        load_categories();
      }
  });
  
  const load_categories = async () => {
    try {
      const result = await ApiService.FetchLibraryCategoryParentSideBar(subjectId);
      const data = result.data;
      if (result.data.data.data && result.data.data.data.length > 0) {
          setCategoryItemList(data.data.data);
          setSubject(data.data.subject);
      } else {
        setCategoryItemList([]);
        setSubject([]);
      }
    } catch (error) {
      console.error('Error fetching sidebar menu list', error);
    }
  };
  
  const load_bookcases = async () => {
    try {
      const result = await ApiService.FetchLibraryCategoryParentChildSideBar(subjectId, bookcaseId);
      const data = result.data.data;
      if (result.data.data.bookcases && result.data.data.bookcases.length > 0) {
        setBookcaseItemList(data.bookcases);
        setBookcaseObject(data.category)
      } else {
        setBookcaseItemList([]);
      }
    } catch (error) {
      console.error('Error fetching sidebar menu list', error);
    }
  };

  const load_journals_on_category = async (packageId, subjectId) => {
    setJournalLoader(true);
    setEmptyJournalError(false);
    setDbError(false)
    setLoadMoreResource(false)
    setProcessLoadMoreResource(false)
    try {
      const result = await ApiService.FetchAllJournalsOnCategory(packageId, subjectId, 1);
      const data = result.data._items;
      if (result.data._items.data && data.data.journalList.length > 0) {
        setTimeout(() => {
          setJournalLoader(false);
          setEmptyJournalError(false);
          setDbError(false)
          setProcessLoadMoreResource(false)
          setJournalList(data.data.journalList);
          monitorStation("subjects", subjectId, result.data._items.rowCount, 1)
        }, 2000);
        if (result.data._items.rowCount > 49 || result.data._items.rowCount == 50) {
          setLoadMoreResource(true)
        }
      } else {
        setLoadMoreResource(false)
        setProcessLoadMoreResource(false)
        setTimeout(() => {
          setJournalList([]);
          setJournalLoader(false);
          setEmptyJournalError(true);
          setDbError(false)
        }, 2000);
      }
    } catch (error) {
      console.error('Error fetching sidebar menu list', error);
      setLoadMoreResource(false)
      setProcessLoadMoreResource(false)
      setTimeout(() => {
        setJournalLoader(false);
        setEmptyJournalError(false);
        setDbError(true)
      }, 2000);
    }
  }

  const load_journals_on_bookcase = async (packageId, subjectId, bookcaseId) => {
    setJournalLoader(true);
    setEmptyJournalError(false);
    setDbError(false)
    setLoadMoreResource(false)
    setProcessLoadMoreResource(false)
    setShowSort(false);
    setShowSubject(false);
    try {
      const result = await ApiService.FetchAllJournalsOnBookCase(packageId, subjectId, bookcaseId, 1);
      const data = result.data._items;
      if (result.data._items.data && data.data.journalList.length > 0) {
        prevBookcaseId.current = bookcaseId; 
        setTimeout(() => {
          setJournalLoader(false);
          setEmptyJournalError(false);
          setDbError(false)
          setProcessLoadMoreResource(false)
          setJournalList(data.data.journalList);
          monitorStation("bookcases", bookcaseId, result.data._items.rowCount, 1)
        }, 2000);

        if (result.data._items.rowCount > 49 || result.data._items.rowCount == 50) {
          setLoadMoreResource(true)
        }
      } else {
        setLoadMoreResource(false)
        setTimeout(() => {
          setJournalList([]);
          setJournalLoader(false);
          setEmptyJournalError(true);
          setDbError(false)
          setProcessLoadMoreResource(false)
        }, 2000);
      }
    } catch (error) {
      console.error('Error fetching sidebar menu list', error);
        setLoadMoreResource(false)
        setTimeout(() => {
        setJournalLoader(false);
        setEmptyJournalError(false);
        setDbError(true)
        setProcessLoadMoreResource(false)
      }, 2000);
    }
  }

  const load_journals_on_bookshalves = async (packageId, subjectId, bookcaseId, bookshalveId) => {
    setJournalLoader(true);
    setEmptyJournalError(false);
    setDbError(false)
    setLoadMoreResource(false)
    setProcessLoadMoreResource(false)
    try {
      const result = await ApiService.FetchAllJournalsOnBookShalve(packageId, subjectId, bookcaseId, bookshalveId, 1);
      const data = result.data._items;
      if (result.data._items.data && data.data.journalList.length > 0) {
        setTimeout(() => {
          setJournalLoader(false);
          setEmptyJournalError(false);
          setDbError(false)
          setProcessLoadMoreResource(false)
          setJournalList(data.data.journalList);
          monitorStation("bookshelves", bookshalveId, result.data._items.rowCount, 1)
        }, 2000);

        if (result.data._items.rowCount > 49 || result.data._items.rowCount == 50) {
          setLoadMoreResource(true)
        }
      } else {
        setLoadMoreResource(false)
        setProcessLoadMoreResource(false)
        setTimeout(() => {
          setJournalList([]);
          setJournalLoader(false);
          setEmptyJournalError(true);
          setDbError(false)
        }, 2000);
      }
    } catch (error) {
      console.error('Error fetching sidebar menu list', error);
      setLoadMoreResource(false)
      setProcessLoadMoreResource(false)
      setTimeout(() => {
        setJournalLoader(false);
        setEmptyJournalError(false);
        setDbError(true)
      }, 2000);
    }
  }

  const load_more_journals = async () => {
    const station = getStation();
    const active_point = station[1];
    const active_pr_id = station[2];
    var page = station[3]; 
    const current_page = page+1;
    const result = (active_point == 'subjects' ? await ApiService.FetchAllJournalsOnCategory(packageId, subjectId, current_page) :
      active_point == 'bookcases' ? await ApiService.FetchAllJournalsOnBookCase(packageId, subjectId, bookcaseId, current_page) :
      active_point == 'bookshelves' ? await ApiService.FetchAllJournalsOnBookShalve(packageId, subjectId, bookcaseId, bookshalvesPort, current_page) : '');
      const data = result.data._items;
      if (result.data._items.data && data.data.journalList.length > 0) { 
        // 
        setJournalList(prev => [...prev, ...data.data.journalList]);
        setProcessLoadMoreResource(false);
        monitorStation(active_point, active_pr_id, result.data._items.rowCount, current_page)
       
      } else {
        setLoadMoreResource(false)
        setProcessLoadMoreResource(false)
        setTimeout(() => {
          setJournalLoader(false);
          setEmptyJournalError(false);
          setDbError(false)
        }, 2000);
      }
  }

  const handleLoadMore = async () => {
    if (pathnameSegments[0] == "library" &&
      pathnameSegments[1] != "" &&
      pathnameSegments[2] == "subjects" &&
      pathnameSegments[4] == "" &&
      pathnameSegments[5] == null &&
      pathnameSegments[6] == null &&
      pathnameSegments[7] == null) { 
      // Load more category journals
      setProcessLoadMoreResource(false)
      setTimeout(() => {
        load_more_journals();
      }, 2000);
    }
    else if (pathnameSegments[0] == "library" &&
      pathnameSegments[1] != "" &&
      pathnameSegments[2] == "subjects" &&
      pathnameSegments[4] != "" &&
      pathnameSegments[5] != null &&
      pathnameSegments[6] == null &&
      pathnameSegments[7] == null) {
      // Load bookcase journal
      setProcessLoadMoreResource(false)
      setTimeout(() => {
        load_more_journals();
      }, 2000);
      
    }
    else if (pathnameSegments[0] == "library" &&
      pathnameSegments[1] != "" &&
      pathnameSegments[2] == "subjects" &&
      pathnameSegments[4] != "" &&
      pathnameSegments[5] != null &&
      pathnameSegments[6] != null &&
      pathnameSegments[7] != "") {
      // Load bookshalve journal
      setProcessLoadMoreResource(false)
      setTimeout(() => {
        load_more_journals();
      }, 2000);
    }
    
    setProcessLoadMoreResource(true)
  }

  const handleToggleSubject = () => {
    if (!showSubject) {
      setShowSort(false);
      setShowSubject(true);
    } else {
      setShowSubject(false);
    }
  };

  const handleToggleSort = () => {
    if (!showSort) {
      setShowSubject(false);
      setShowSort(true);
    } else {
      setShowSort(false);
    }
  };

  const handleReturnHome = () => {
    window.history.back();
  };
  

  useEffect(() => {
    
    const hasBookcases = !!bookcaseId;
    const hasBookshelves = !!bookshelfId;

    if (hasBookshelves) {
      // Only fetch if bookshelfId changed
      if (prevBookshelfId.current !== bookshelfId) {
        prevBookshelfId.current = bookshelfId;
        load_categories();
        load_bookcases()
        monitorStation("bookshelves", bookshalvesPort, 0, 1)
        setTimeout(load_journals_on_bookshalves(packageId, subjectId, bookcaseId, bookshalvesPort), 2000);
      }
    } else if (hasBookcases) {
      // Only fetch if bookcaseId changed
      if (prevBookcaseId.current !== bookcaseId) {
        prevBookcaseId.current = bookcaseId;
        load_categories();
        load_bookcases(bookcaseId);
        setTimeout(load_journals_on_bookcase(packageId, subjectId, bookcaseId), 2000);
        monitorStation("bookcases", bookcaseId, 0, 1)
      }
    } else {
      // Default state
      load_categories();
      setTimeout(load_journals_on_category(packageId, subjectId), 2000);
      monitorStation("subjects", subjectId, 0, 1)
      prevBookcaseId.current = null;
      prevBookshelfId.current = null;
    }
  }, [location.pathname]);

  return (
    <>
      <Header />
      <SideBarDrawer />
      <div id="ember-basic-dropdown-wormhole"></div>
      <div id="loom-companion-mv3" ext-id="liecbddmkiiihnedobmlmillhodjkdmb">
        <section id="shadow-host-companion"></section>
      </div>

      <div id="ember404" className="ember-view">
        <aside className="route-announcer">
            <div aria-live="polite" id="ember432" className="screen-reader ember-view">Loaded SkyBase Data</div>
        </aside> 
        <div className="media-desktop locale-en-us" style={{ marginTop: "-20px" }} id="locale-en-us">
            <div className="canvas">
                <div id="library-content" className="container ">
                    <main className="holdings-container">
                        <div className="subject" >
                          <Link to={ '/'} id="ember1122" className="subject-back-button ember-view" style={{ color: "red" }}> 
                              <FontAwesomeIcon icon={faArrowLeft} />&nbsp;Change Subject
                          </Link> 
                          <h1 className="subject-name category-name">{subject?.subjects_name || 'No Subject'}</h1>
                          <h4 className="subject-bookcase-list-header">Categories</h4>
                          <ul className="subject-bookcase-list"> 
                              <li className="subject-bookcase-list-item categoryList">
                                <Link to={`/library/${subject.package_id}/subjects/${subject.subjectid}/?sort=title&all=1`} id="ember1123" className={`ember-view ${paramAll1}`} onClick={() => load_journals_on_category(packageId, subject.subjectid)}> 
                                  All Journals</Link>
                              </li>
                                  <div className="category_list">
                                    {categoryItemList.map((cat) => (
                                      <li className="subject-bookcase-list-item" key={cat.categoryid}>
                                        <Link
                                          to={`/library/${packageId}/subjects/${subjectId}/bookcases/${cat.categoryid}?sort=title`}
                                          className={libraryPort!="" && subjectPort!="" && bookcasesPort==cat.categoryid? 'active' : ''}>
                                          {cat.category_name}
                                        </Link>
                                      </li>
                                    ))}
                                  </div>
                              </ul>
                            </div>
                                    
                            {/*  */}
                            { hasBookcases && (
                               <div className="bookcase">
                                  <h3  className="bookcase-name">
                                  {/*  */}
                                </h3>
                                <ul className="bookcase-bookshelf-list" >
                                    <li className="bookcase-bookshelf-list-item" style={{fontSize:"18px",color: "#666"}}>
                                      <Link to={`/library/${packageId}/subjects/${bookcaseObject.subjectid}/bookcases/${bookcaseId}?sort=title`} id="ember1115"
                                        className={`ember-view ${paramAll2}`} onClick={() => load_journals_on_bookcase(packageId, bookcaseObject.subjectid, bookcaseId)}><span>All Journals</span></Link>
                                    </li>
                                    <div className="bookcaseList">
                                        {bookcaseItemList.map((book)=>
                                            <li className="bookcase-bookshelf-list-item" key={book.bookshelvesid}>
                                              <Link to={`/library/${book.package_id}/subjects/${book.subjectid}/bookcases/${book.categoriesid}/bookshelves/${book.bookshelvesid}?sort=title`} id="ember1119" 
                                                className={pathParts[8] ==book.bookshelvesid ?' active':'' }  style={{fontSize:"18px",color: "#666"}}>
                                                <span>{book.bookshelves_name}</span>
                                              </Link>
                                                <div id="ember1126" className="ember-view"></div>
                                            </li>
                                            )}
                                    </div>
                                </ul> 
                            </div>
                            )}
                           
                          <div id="Content_Sidebar" className="journals-container infinite-scroller ember-view" style={{ marginTop: "40px" }}>
                            <div className="controls-container" id="case1">
                                <ul className="controls">
                                    <li id="returnHome" className="back subject-back-button tabIndex" onClick={handleReturnHome}>
                                        <span aria-hidden="true" className="icon flaticon solid left-2"></span> Back
                                    </li>
                                    <li  className={`categories tabIndex ${showSubject ? 'active' : ''}`} onClick={handleToggleSubject} id="view_mobile_toggle_subject">
                                        Refine <span aria-hidden="true" className="icon flaticon solid down-2"></span>
                                    </li>
                                    <li  className={`sort tabIndex ${showSort ? 'active' : ''}`} onClick={handleToggleSort}  id="view_sort_toggle">
                                        Sort <span aria-hidden="true" className="icon flaticon solid down-2"></span>
                                    </li>
                                </ul>
                                {showSubject && (
                                  <ul className="subject-bookcase-list bookcase-bookshelf-list" id="hidden_subject_list">
                                        <li id="ember7338" className={`subject-bookcase-list-item all-journals ember-view ${paramAll1}`}>
                                          <Link to={`/library/${packageId}/subjects/${subjectId}?sort=title&all=1`} id="ember7339" className="active ember-view">
                                                <div className="text">All Journals - {subject?.subjects_name || 'No Subject'}</div>
                                            </Link>
                                            <span aria-hidden="true" className="icon flaticon solid down-2"></span>
                                        </li>
                                        {categoryItemList.map((cat) => (
                                          <li className={`subject-bookcase-list-item ${pathParts[4] !== "" && pathParts[6] !== "" && pathParts[6] == cat.categoryid ? 'active' : ''}`} key={cat.categoryid} >
                                              <Link  to={`/library/${packageId}/subjects/${subjectId}/bookcases/${cat.categoryid}?sort=title`} id="ember7341" className="ember-view" >
                                                  <div className="text">{cat.category_name}</div>
                                              </Link> <span aria-hidden="true" className="icon flaticon solid down-2"></span>
                                          </li>
                                        ))}
                                    </ul>
                                )}

                                {showSort && (
                                  <ul className="sort-controls" id="hidden_sort">
                                      <li id="ember8453" className="sort-control active ember-view">
                                          <Link to={'/'} id="ember8454" className="sort-control sort-by-title active ember-view">                
                                              <div className="text">Journals By Title (A-Z)</div>
                                          </Link>             
                                          <span aria-hidden="true" className="icon flaticon solid"></span>
                                      </li>
                                      <li id="ember8455" className="sort-control ember-view">
                                          <Link  to={`/library/${packageId}/subjects/${subjectId}?sort=rank`} id="ember8456" className="sort-control sort-by-scimago ember-view">                
                                              <div className="text">Journals By Scimago Rank</div>
                                          </Link>              
                                          <span aria-hidden="true" className="icon flaticon solid"></span>
                                      </li>         
                                  </ul>
                              )}
                            </div>
                            <div style={{ marginRight: "47.200000000000045px" }} id="ember791" className="sort-options-container __eccf5 ember-view">
                                <div className="sort-options">
                                    <span className="active"> 
                                      <Link aria-label="A-Z" to={'/'} id="ember792" className="sort-control sort-by-title hide-underline active ember-view" > 
                                          SORT <span className="show-underline">A-Z /</span>
                                        </Link>
                                      </span>
                                    <span>
                                        <Link aria-label="Journal Rank" to={'/'} id="ember793" className="sort-control sort-by-scimago ember-view" >JOURNAL RANK</Link>
                                    </span>
                                </div>
                            </div>
                                <ul className="bookshelf">
                                {!journalLoader && !emptyJournalError && !dbError && journalList.map((j) => (
                                  <li className="bookshelf-journal-list-item" key={j.id}>
                                      <div id="ember8270" className="ember-view">
                                          <Link to={`/library/${j.packageid}/journals/${j.id}/issues/current/sort/title`} id="ember8271" className="bookshelf-journal ember-view" tabIndex="0">
                                              <div id="ember8272" className="journal-cover __771d8 ember-view">
                                                  <div className="image-container">
                                                      <img src={`${j.file}`} alt={j.journal_name} title={j.journal_name}/>
                                                    </div>
                                              </div>
                                              <div title={j.journal_name} className="bookshelf-journal-title">{j.journal_name}</div>
                                          </Link>
                                      </div>
                                  </li>
                                  ))}
                                <div id="child_container"></div>
                                </ul>
                                <div style={{marginBottom:"60px"}}>
                                    <div className="bookshelf-loading-indicator" id="loading" style={{ display: journalLoader || emptyJournalError || dbError || loadMoreResource || processLoadMoreResource ? 'block' : 'none' }}>
                                        <div id="ember1952" className="__0d2b3 ember-view">
                                            <div className="spinner align-center" style={{ display: journalLoader || processLoadMoreResource ? 'block' : 'none' }} id="spinnerLoad">
                                                <div className="bounce1"></div>
                                                <div className="bounce2"></div>
                                                <div className="bounce3"></div>
                                            </div>
                                        </div>
                                        <div className="error-screen" style={{textAlign: "center", display: "grid", margin: "0 auto"}}>
                                            <div  className="message" style={{display: dbError ? 'block' : 'none'}}>
                                                <p>An error occurred while contacting the Skybase database center.</p>
                                                <p>Third Iron support has been notified.</p>
                                            </div>
                                            <div className="error-msg" style={{display: emptyJournalError ? 'block': 'none'}}>
                                                <p>No journals found on this or related to this subject.!</p>
                                            </div>
                                        </div>
                                        <div className="mt-5" style={{marginTop:"15px"}}>
                                        <button
                                          className={`button ${emptyJournalError ? 'primary' : ''}`}
                                          id="loadMoreButton"
                                          style={{ placeItems: "center", display: "grid", margin: "0 auto" }}
                                          onClick={loadMoreResource ? handleLoadMore : undefined}>
                                          {journalLoader || processLoadMoreResource
                                            ? 'Loading...'
                                            : emptyJournalError
                                            ? 'Try Again...!'
                                            : loadMoreResource
                                            ? 'Load More'
                                            : 'Error'}
                                        </button>


                                        </div>
                                    </div>
                                </div>
                              </div>
          
                          </main>
                    <div id="ember797" className="ember-view"></div>
                    <ul className="responsive-menu"></ul>
                </div>
            </div>
        </div>
      </div>
      
    </>
  )
}

export default Library

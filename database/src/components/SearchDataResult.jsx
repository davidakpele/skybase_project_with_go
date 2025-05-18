import React from 'react';
import { Link } from 'react-router-dom';
import { useRef } from "react";

const SearchDataResult = ({ data, filterBySubjectsOnly, filterByAllResults, filterByJournalsOnly}) => {
    const containerRef = useRef();

  return (
      <>
      <li className="filter-container">
        <span className=" results-label-header">Results</span>
        <div className="filters">
            <div aria-label="See all Subjects and Journals" tabIndex="0" className="filter all active tabIndex view_All_Search" onClick={filterByAllResults}>
                <div className="label icon flaticon solid article-2"> All Results</div>
            </div>
            <div aria-label="See all Subjects only" tabIndex="0" className="filter subjects tabIndex"  onClick={filterBySubjectsOnly}>
                <div className="icon flaticon solid files-1"> Subjects</div>
            </div>
            <div aria-label="See all Journals only" tabIndex="0" className="filter journals tabIndex" onClick={filterByJournalsOnly}>
                <div className="icon flaticon solid journal-2"> Journals</div>
            </div>
        </div>
    </li> 
    <li className="result-container" ref={containerRef} style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <ul>
            <div id="ember1093" className="ember-view">
                <div id="ember1871" className="infinite-scroller ember-view">
               
                                   
                    {data.subjects && data.subjects.length > 0 && (
                        <div>
                            {data.subjects.map((subject, index) => (
                                <li key={index} className="result subject ">
                                    <div id="ember1942" className="ember-view">
                                        <Link tabIndex="0" to={`/library/${subject.packageid}/subjects/${subject.subjectid}/?sort=title&all=1`} id="ember1943" className="ember-view">
                                            <div title={subject.subjects_name} className="text">
                                            View All Journals Under - {subject.subjects_name}
                                            </div>
                                            <div className="icon flaticon solid files-1"></div>
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </div>
                        )}        
                         {data.journals && data.journals.length > 0 && (
                            <div>
                                {data.journals.map((journal, index) => (
                                    <li key={index} className="result journal first-result ">
                                        <div id="ember1872" className="ember-view">
                                            <Link to={`/library/603/journals/${journal.id}`} id="ember1873" className="ember-view" >
                                                <div title={journal.journal_name} className="text">
                                                {journal.journal_name}
                                                </div>
                                                <div className="icon flaticon solid journal-2"></div>
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </div>
                            )}
                        {data.bookshelves && data.bookshelves.length > 0 && (
                            <div>
                                {data.bookshelves.map((bookshelf, index) => (
                                <li key={index} className="result subject">
                                    <div id="ember1942" className="ember-view">
                                        <Link tabIndex="0" to={`/library/${bookshelf.packageid}/subjects/${bookshelf.subjectid}/bookcases/${bookshelf.categoryid}/bookshelves/${bookshelf.bookshelvesid}`} id="ember1943" className="ember-view">
                                            <div title={bookshelf.bookshelves_name} className="text">
                                            {bookshelf.bookshelves_name}
                                            </div>
                                            <div className="icon flaticon solid files-1"></div>
                                        </Link>
                                    </div>
                                </li>
                                ))}
                            </div>
                            )}
                </div>
                <div id="ember1952" className="__0d2b3 ember-view">
                    <div className="spinner align-center">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                    </div>
                </div>
            </div>
        </ul>
    </li>
      </>
  );
};

export default SearchDataResult;

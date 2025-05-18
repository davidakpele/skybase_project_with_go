import React from 'react'
import { Suspense } from 'react'; 
import "./Header.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars } from '@fortawesome/free-solid-svg-icons';
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/images/logo.svg"
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"


const Header = () => {
    const { getUsername } = useAuth()
  return (
    <>
      <header role="banner" data-id="pnlGlobalHeader" className="pubs-header">
        <div className="viewport" style={{ display: "flex" }}>
        <div className="pubs-header__wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                {/* <div className="pubs-header__cell pubs-header__cell--menu">
                <Link to="/" relative="path"
                role="button"
                id="btnHamburgerMainNav"
                className="pubs-header__btn pubs-header__btn--open"
                aria-label="Open site menu">
                <FontAwesomeIcon icon={faBars}  />
                </Link>
                </div> */}
                <div className="pubs-header__cell pubs-header__cell--home">
                <Link to="/" relative="path" ><img src={Logo} height="40" alt="Royal Society of Chemistry homepage"/></Link>
                </div>
                <div className="pubs-header__cell pubs-header__cell--nav">
                    <nav className="pubs-header__nav">
                        <ul>
                            <li className="pubs-header__nav-item"><Link to="/" relative="path" className="pubs-header__link" style={{display:"flex"}}>Advance Search</Link></li>
                        </ul>
                    </nav>
                </div>
                {/* <div className="pubs-header__cell pubs-header__cell--search-mobile" id="mobileSearchTrigger">
                    <Link to="/" relative="path"  className="pubs-header__btn" aria-label="Search" id="mobileSearchTrigger">
                    <FontAwesomeIcon icon={faSearch}  id="mobileSearchIcon"/></Link>
                </div> */}
                {/* <div className="pubs-header__cell pubs-header__cell--search">
                    <div className="pubs-search-control">
                        <form aria-label="Sitewide" id="SimpleSearch-form" method="post" role="search"> 
                        <FontAwesomeIcon icon={faSearch} className="fa fa-search header_search_icon"/>
                            <input
                                autoComplete="off"
                                className="pubs-search__input"
                                id="SearchText"
                                name="SearchText"
                                type="search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                />
                            <div className="pubs-search__actions">
                                <button className="input__search-submit" type="submit" aria-label="Search" id="btnNavSearchInput">
                                <FontAwesomeIcon icon={faSearch}  className="fa fa-search"/>
                                
                                </button>
                                <Link to="/" relative="path"  className="pubs-search__adv-link" aria-label="Advanced search" id="advancedLink">Advanced</Link>
                            </div>
                            <span className="pubs-search__icon"></span>
                        </form>
                    </div>
                </div> */}
                {getUsername() &&
                    <div className="pubs-header__cell pubs-header__cell--trolley" style={{ marginLeft: 'auto' }}>
                        <Link to="/auth/logout" relative="path"><i className="fa fa-user" aria-hidden="true" id="trolleyIcon"></i> </Link>
                    </div>
                }
             
            </div>
        </div>
        <div className="mobile-search" id="mobileSearchPanel">
            <div className="viewport">
                <div className="">
                    <div className="autopad--h fixpadt--l">
                        <form action="javascript:void(0)" aria-label="Sitewide" id="SimpleSearch-formMobile" method="post" role="search"> 
                            <label htmlFor="SearchTextMobile" className="sr-only">Search</label>
                            <div className="input__search">
                                <i className="icon--search"></i>
                                <input autoComplete="off" placeholder="Search term, doi, title, author" type="search" className="input__field input__field--basic input__label--block" id="SearchTextMobile" name="SearchText"/>
                                <button className="input__search-submit" name="search" type="submit" aria-label="Search">
                                <FontAwesomeIcon icon={faArrowRight} width="12" alt="" className="input__submit-icon"/>
                                </button>
                            </div>
                            <div className="input--error" id="errSimpleSearchMobileText">You must enter a search term</div>
                            <div className="fixpadv--m">
                            <Link to="/" relative="path"  className="pubs-search__adv-link " aria-label="Advanced search" id="advancedLink">Advanced search</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
         
    </header>
    </>
  )
}

export default Header

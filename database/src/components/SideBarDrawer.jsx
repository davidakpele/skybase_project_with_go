import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const SideBarDrawer = () => {
  return (
    <>
    <div className="pubs-nav-drawer" aria-hidden="false">
        <nav className="pubs-nav-control" aria-label="Site menu">
            <div className="pubs-nav__header" style={{display:"flex"}}>
                <div role="button" className="pubs-header__btn pubs-nav__close nav-item-first"  aria-label="Close site menu">
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <Link to={"/"} className="pubs-header__link--home pubs-nav__title"  title="Publishing home page" aria-label="Publishing home page">Publishing</Link>
            </div>
            <div className="pubs-nav__body scrollbar--slim">
                <div className="pubs-nav__list autopad--h">
                    <h2 className="pubs-nav__heading">Journals</h2>
                    <ul className="pubs-nav__ul">
                        <li className="pubs-nav__item pubs-nav__indent">
                            <Link to={"/"} className="pubs-nav__link" >Current Journals</Link>
                        </li>
                        <li className="pubs-nav__item pubs-nav__indent">
                            <Link to={"/"} className="pubs-nav__link" >Archive Journals</Link>
                        </li>
                        <li className="pubs-nav__item pubs-nav__indent">
                            <Link to={"/"} className="pubs-nav__link" >All Journals</Link>
                        </li>
                    </ul>
                </div>
                <div className="pubs-nav__list autopad--h">
                    <h2 className="pubs-nav__heading">Books</h2>
                    <ul className="pubs-nav__ul">
                        <li className="pubs-nav__item pubs-nav__indent">
                            <Link to={"/"} className="pubs-nav__link" >e-Books</Link>
                        </li>
                        <li className="pubs-nav__item pubs-nav__indent">
                            <Link to={"/"} className="pubs-nav__link" >Series</Link>
                        </li>
                    </ul>
                </div>
                <div className="pubs-nav__list autopad--h">
                    <h2 className="pubs-nav__heading">Databases</h2>
                    <ul className="pubs-nav__ul">
                        <li className="pubs-nav__item pubs-nav__indent">
                            <Link to={"/"} className="pubs-nav__link" >Literature Updates</Link>
                        </li>
                        <li className="pubs-nav__item pubs-nav__indent">
                            <Link to={"/"} className="pubs-nav__link" >ChemSpider</Link>
                        </li>
                        <li className="pubs-nav__item pubs-nav__indent">
                            <Link to={"/"} className="pubs-nav__link" >The Merck Index*</Link>
                        </li>
                        <li className="pubs-nav__item pubs-nav__indent">
                            <Link to={"/"} className="pubs-nav__link" >MarinLit</Link>
                        </li>
                    </ul>
                </div>
                <div className="pubs-nav__list autopad--h">
                    <h2 className="pubs-nav__heading">More</h2>
                    <ul className="pubs-nav__ul">
                        <li className="pubs-nav__item pubs-nav__indent">
                            <Link to={"/"} className="pubs-nav__link" >For Librarians</Link>
                        </li>
                    </ul>
                </div>
                <div className="pubs-nav__list autopad--h">
                    <h2 className="pubs-nav__heading">Dashboard</h2> 
                    <ul className="pubs-nav__ul">
                        <li className="pubs-nav__item pubs-nav__indent">
                          <Link to={"/"} className="pubs-nav__link nav-item-last" id="logout_user" >Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
    
    </>
  )
}

export default SideBarDrawer

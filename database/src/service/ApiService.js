import { Component } from 'react';
import xhrClient from "../api/xhrClient";
// import $ from 'jquery'
import jwt from '../util/jwt';

var api_url = "http://localhost:7099";

export default new class APIServices extends Component {
    
    constructor() {
        super();
        this.token = jwt.GetUserToken();
        this.package_plan_Id = jwt.GetSubscribedPackageId();
    }

    SearchData = async(searchQuery) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=search&query=${encodeURIComponent(searchQuery)}&packageId=${this.package_plan_Id}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
    }

    FetchSubjectList = async() => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=package_items&packageId=${this.package_plan_Id}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
    }

    FilterOnlyByJournals = async(searchQuery) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=search&filter=journalsOnly&query=${encodeURIComponent(searchQuery)}&packageId=${this.package_plan_Id}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
    }

    FilterOnlyBySubjects = async(searchQuery) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=search&filter=subjectsOnly&query=${encodeURIComponent(searchQuery)}&packageId=${this.package_plan_Id}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
    }
    
    FetchLibraryCategoryParentSideBar = async (subjectId) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=getCategoryListOnparent&library=${this.package_plan_Id}&subject=${subjectId}&getCategoryList=true`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }   
    } 

    FetchLibraryCategoryParentChildSideBar = async (subjectId, bookcasesId) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=getCategoryListOnparentChild&library=${this.package_plan_Id}&subject=${subjectId}&bookcases=${bookcasesId}&getbookcaseList=true`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }   
    }


    FetchJournalsOnCategoryDisplayAll = async (subjectId, page) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection/action=category_journal_list_all&library=${this.package_plan_Id}&subject=${subjectId}&page=${page}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }   
    }

    FetchJournalOnBookshalvesDisplayAll = async (subjectId, bookcasesId, bookshelvesId, page) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=dataContext&library=${this.package_plan_Id}&subject=${subjectId}&bookcases=${bookcasesId}&bookshelves=${bookshelvesId}&page=${page}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
        
    }
    
    FetchJournalById = async (id) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=journal&id=${id}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
    }


    FetchAllJournalsOnCategory = async (packageId, subjectId, page) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=category_journal_list_all&library=${packageId}&subject=${subjectId}&page=${page}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
    }
    
    FetchAllJournalsOnBookCase = async (packageId, subjectId, bookcaseId, page) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=bookcase_journal_list_all&library=${packageId}&subject=${subjectId}&bookcases=${bookcaseId}&page=${page}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
    }

    FetchAllJournalsOnBookShalve = async (packageId, subjectId, bookcaseId, bookshalveId, page) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=dataContext&library=${packageId}&subject=${subjectId}&bookcases=${bookcaseId}&bookshelves=${bookshalveId}&page=${page}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
    }
    
    FetchAllPublicationYear = async (journalId) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=publicationYear&id=${journalId}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
    }

    HandleFetchAllIssueByJournalId = async (journalId, packageId) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=issue&journalId=${journalId}&packageId=${packageId}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
    }

    FetchAllArticles = async (journalId, issueId, page) => {
        try {
            const request = await xhrClient(`${api_url}/api/collection?action=articles&journalid=${journalId}&issueid=${issueId}&page=${page}`, 'GET', {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            });
            return request;
        } catch (error) { 
            return error;
        }
    }
}
package dto

type JournalAttributes struct {
	Title                   string  `json:"title"`
	SimplifiedTitle         string  `json:"simplifiedTitle"`
	ScimagoRank             float64 `json:"scimagoRank"`
	CoverURL                string  `json:"coverURL"`
	HomePageAtPublisherSite string  `json:"homePageAtPublisherSite"`
	Available               bool    `json:"available"`
	ScimagoURL              string  `json:"scimagoURL"`
	ISSN                    string  `json:"issn"`
	BrowzineWebJournalLink  string  `json:"browzineWebJournalLink"`
	BookshelvesId  			string  `json:"BookshelvesId"`
	CategoryID              string  `json:"cattegoryId"`
	Status  				string  `json:"status"`
	Views  					int  	`json:"views"`
	Pages              		int  	`json:"page"`
	Likes  					int  	`json:"likes"`
	ResponseID  			string  `json:"responseId"`
	ExternalReference       string  `json:"external_reference"`
	DistributionChannel  	string  `json:"distribution_channel"`
	UserLanguage  			string  `json:"userLanguage"`
	ResourceTitle           string  `json:"resource_title"`
	ResourceDescription  	string  `json:"resource_description"`
	ResourceCategory  		string  `json:"resource_category"`
	ResourceIdentityGroup   string  `json:"resource_identity_group"`
	TargetAudience  		string  `json:"target_audience"`
	ResourceSuppose  		string  `json:"resource_suppose"`
	ResourceLink            string  `json:"resource_link"`
	File  					string  `json:"file"`
	FileName  				string  `json:"file_name"`
	
	LibraryID uint             `json:"library_id"`
	Issues    []IssueDTO   `json:"issues"`
}

type RelationshipLink struct {
	Related string `json:"related"`
}

type JournalRelationships struct {
	Library struct {
		Links RelationshipLink `json:"links"`
	} `json:"library"`
	Issues struct {
		Links RelationshipLink `json:"links"`
	} `json:"issues"`
}

type JournalResponse struct {
	Data struct {
		ID            uint                `json:"id"`
		Type          string              `json:"type"`
		Attributes    JournalAttributes   `json:"attributes"`
		Relationships JournalRelationships `json:"relationships"`
	} `json:"data"`
}

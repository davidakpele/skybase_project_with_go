package models

import "gorm.io/gorm"

type Library struct {
	gorm.Model
	Name                                      string
	LogoURL                                   string `gorm:"column:logo_url"`
	CustomBackgroundImageURL                  string
	DefaultIssue                              string
	InfoURL                                   string
	WebInfoURL                                string
	UserAgent                                 string
	HasVPN                                    bool
	ILLDescription                            string `gorm:"column:ill_description"`
	UseIPRangeForProxyUsage                   bool
	UseBZAuth                                 bool
	ExternalSearchHeader                      string
	AZSystem                                  string `gorm:"column:az_system"`
	AZSystemLibraryID                         string `gorm:"column:az_system_library_id"`
	AToZListURL                               string `gorm:"column:a_to_z_list_url"`
	WebStripsProxy                            bool
	DisplayPublisherHomePageLinkButton        bool
	AccessProvidedByLink                      string
	PromoLink                                 string
	ExternalSearchLocation                    string
	SupportsILL                               bool `gorm:"column:supports_ill"`
	LogoHasLibraryName                        bool
	PromoteNativeApp                          bool
	ArticleTitleUsesBestAvailableLink         bool
	WebLoginInfoLinkURL                       string
	PubMedFallbackTemplate                    string
	FallbackFulfillmentOption                 string
	LinkResolverURLBase                       string
	EmailArticleRequestTemplate               string
	LibkeyFallbackTemplate                    string
	LibkeyFallbackURL                         string
	LibkeyInterstitialDisplayFormat           string
	LibkeyLinkDefaultMode                     string
	GoogleScholarLibraryID                    string
	GoogleScholarLibraryName                  string
	BPSLibrary                               bool `gorm:"column:bps_library"`
	TunnelingProxy                           string
	ForceAuthAtFrontDoor                      bool
	ForceAuthAtNativeAppsFrontDoor            bool
	DoIPCheckBeforeCrawling                   bool
	RestrictNonOACrawlingToIPRange            bool
	SSOEnabled                               bool `gorm:"column:sso_enabled"`
	SSORequiredOnSite                        bool `gorm:"column:sso_required_on_site"`
	LanguagesSupported                       string
	UseLiveUnpaywallCalls                    bool
	CustomEmbargoMessage                     string
	CustomAvailabilityMessage                string
	AllBackIssuesMessage                     string
	AccessProvidedByLabel                    string
	PromoLabel                               string
	ExternalSearchLinkMessage                string
	UserSessionLength                        *int

	// Relationships
	AuthNames          LibraryAuthName          `gorm:"foreignKey:LibraryID"`
	AZTemplates        LibraryAZTemplate        `gorm:"foreignKey:LibraryID"`
	NativeLoginInfo    LibraryNativeLoginInfo   `gorm:"foreignKey:LibraryID"`
	WebLoginInfo       LibraryWebLoginInfo      `gorm:"foreignKey:LibraryID"`
	Subscriptions      []LibrarySubscription    `gorm:"foreignKey:LibraryID"`
	SocialMedia        LibrarySocialMedia       `gorm:"foreignKey:LibraryID"`
	Services           LibraryService           `gorm:"foreignKey:LibraryID"`
	Support            LibrarySupport           `gorm:"foreignKey:LibraryID"`
	SectionLabels      LibrarySectionLabel      `gorm:"foreignKey:LibraryID"`
	LibkeyLabels       LibraryLibkeyLabel       `gorm:"foreignKey:LibraryID"`
	Subjects           []Subjects                `gorm:"many2many:library_subjects;"`
}
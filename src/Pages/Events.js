import React, { Component } from 'react';
import Loading from "../Components/Loading"
import Breadcrumbs from "../Components/Breadcrumbs"
import EventFilter from '../Components/EventFilter';
import EventGridItem from '../Components/EventGridItem';
import ReactGA from 'react-ga';
class Events extends Component {

    constructor (props){

        if(window.ogSettings.environment === "dev"){
            var api_base_url = "http://127.0.0.1:3000";
        }else{
            var api_base_url = "https://widgetapi.occasiongenius.com";
        }

        super(props);
        this.state = {
            api_base_url: api_base_url,
            current_page: [],
            next_page: [],
            max_pages: [],
            events: [],
            events_url: '/api/events/',
            isLoading: 1,
            start_date: window.ogSettings.og_base_date,
            end_date: window.ogSettings.og_max_base_date,
            min_date: window.ogSettings.og_min_base_date,
            max_date: window.ogSettings.og_max_base_date,
            filter_categories: '',
            filter_areas: ''
        }
        
        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.handleCategories = this.handleCategories.bind(this);
        this.handleAreas = this.handleAreas.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount() {

        Promise.all([
          fetch(this.state.api_base_url + this.state.events_url),
        ])
        .then(([res]) => Promise.all([res.json()]))
        .then(([cat_data]) => this.setState({
          events: cat_data,
          isLoading: 0
        }));

        document.title = "All Local Events";

        if(window.ogSettings.og_ga_ua){
            ReactGA.pageview(window.location.pathname + window.location.search);
        }          

    } 

    fetchData = async (url) => {
    
        this.setState({
            isLoading: 1
        });
        
        await fetch(this.state.api_base_url + this.state.events_url)
          .then((r) => r.json())
          .then((result) => {
            this.setState({
                events: result,
                isLoading: 0
            });
          })
          .catch((e) => {
            console.log(e);
          });
    
    };  

    handleStartDate(event) {
        this.setState({
            start_date: event.target.value,
            min_date: event.target.value
        });
    }

    handleEndDate(event) {
        this.setState({
            end_date: event.target.value
        });
    }

    handleCategories = (e) => {
        let value = Array.from(e.target.selectedOptions, option => option.value);
        this.setState({filter_categories: value});
    }

    handleAreas = (e) => {
        let value = Array.from(e.target.selectedOptions, option => option.value);
        this.setState({filter_areas: value});
    }    

    handleSubmit(event) {        
        var fetch_url = "/wp-json/occasiongenius/v1/events?limit=100&filter_start=" + this.state.start_date + "&filter_end=" + this.state.end_date + "&filter_flags=" + this.state.filter_categories + "&filter_areas=" + this.state.filter_areas;
        console.log(":: Fetch: " + fetch_url);

        this.fetchData(fetch_url);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        event.preventDefault();
    }

    render(){

        console.table(this.state.events);

        const { current_page, next_page, max_pages } = this.state;

        return (
            <>

                <Breadcrumbs page_name="All Local Events" disable_all_events="true" />
                
                <div className="col-span-12">
                    <div className="flow-root">
                        <p className="float-left text-gray-800 text-3xl font-semibold mb-4">
                            All Local Events
                        </p>
                    </div>
                </div>                
                    
      
                <div className="flex w-full flex-wrap">                          
                    <div className="flex flex-col md:w-1/5">
                        <EventFilter 
                            fetchData={this.fetchData}  
                            handleStartDate={this.handleStartDate}
                            handleEndDate={this.handleEndDate}
                            handleCategories={this.handleCategories}
                            handleAreas={this.handleAreas}
                            handleSubmit={this.handleSubmit}
                            start_date={this.state.start_date}
                            end_date={this.state.end_date}
                            min_date={this.state.min_date}
                            max_date={this.state.max_date}
                            />
                    </div>

                    <div className="flex flex-col md:w-4/5 items-center">
                        <div className="grid grid-cols-12 px-18 gap-5">
                            {this.state.isLoading ? (
                                <Loading />
                            ) : (
                                <>                            
                                    {this.state.events?.map((item, index) => (   
                                        <EventGridItem item={item} key={index} />
                                    ))}
                                </>
                            )}                                            
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default Events
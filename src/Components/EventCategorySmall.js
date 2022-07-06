import React from 'react';
import { Link } from "react-router-dom";
import Loading from './Loading';
import EventGridItem from "./EventGridItem"
class EventCategorySmall extends React.Component {
    
    constructor (props){

        if(window.ogSettings.environment === "dev"){
            var api_base_url = "http://127.0.0.1:3000";
        }else{
            var api_base_url = "https://widgetapi.occasiongenius.com";
        }

        super(props);
        this.state = {
            api_base_url: api_base_url,
            events: [],
            category: [],
            isLoading: 1
        }
        
    }

    componentDidMount() {

        Promise.all([
            fetch( this.state.api_base_url + "/api/events/flag/" + this.props.event_cat_id + "/limit/4" ),
          ])
          .then(([res]) => Promise.all([res.json()]))
          .then(([cat_data]) => this.setState({
            events: cat_data,
            category: cat_data,
            isLoading: 0
        }));
  
    }

    render() {

        return ( 
            <>

                <div className="flex items-center justify-center bg-white mb-16">                          
                    <div className="grid grid-cols-12 px-18 gap-5">

                        {this.state.isLoading ? (

                            <Loading />

                        ) : (
                            <>

                                <div className="col-span-12">
                                    <div className="flow-root">
                                        <p className="float-left text-gray-800 text-3xl font-semibold mb-0">
                                            { this.props.event_cat_id.toUpperCase() }
                                        </p>

                                        <Link to={`/category/${ this.props.event_cat_id }`} className="no-underline">
                                            <button className="float-right bg-gray-800 text-white px-2 py-2 rounded-none text-base font-medium hover:bg-gray-800 transition duration-300 mt-[5px] pl-[15px] pr-[15px] uppercase text-base pt-[12px] leading-none hover:bg-gray-600">View All</button>    
                                        </Link>
                                    </div>
                                </div>

                                {this.state.events.map((item, index) => (   
                                    <EventGridItem item={item} key={index} />
                                ))}

                            </>
                        )}      

                    </div> 
                </div>

            </>

        );

    }

}

export default EventCategorySmall;
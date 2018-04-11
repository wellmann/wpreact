'use strict';

// Dependencies
import { h, Component } from 'preact';
import fetch from 'isomorphic-fetch';

// Local dependencies
import withData from '../DataProvider';
//import styles from './styles.css';

// Component
@withData({
    getData: () => {
        return fetch('https://192.168.12.44:3000/wp/index.php/wp-json/wp/v2/posts/?filter[posts_per_page]=1')
            .then((res) => res.json());
    },
    mapToProps: (data) => ({ data }),
})
export default class extends Component {

    render({ data }) {

        return (
            <div>
                Hello Home :)
                <br />
                {JSON.stringify(data)}
            </div>
        );
    }
}
'use strict';

// Dependencies
import { h, Component } from 'preact';

// Higher-Order Component
export default (options) => {
    const {
        getData,
        mapToProps,
    } = options;

    return (WrappedComponent) => {
        const componentName = WrappedComponent.displayName || WrappedComponent.name;

        return class DataProvider extends Component {

            static displayName = `DataProvider(${componentName})`;

            constructor() {
                super();

                this.state = {
                    data: {},
                    loading: true
                };
            }

            componentWillMount() {
                getData()
                    .then((data) => this.setState({ data, loading: false }))
                    .catch((e) => console.error(e));
            }

            render({ }, { data, loading }) {

                return <WrappedComponent {...mapToProps(data)} />
            }
        }
    };
};
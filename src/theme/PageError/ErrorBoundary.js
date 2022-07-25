import React from 'react';
// import Page500 from "./Page500";
import {compose} from "redux";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
        this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    resetErrorBoundary() {
        this.setState({
            error: null,
            errorInfo: null
        });
    }

    render() {
        // if (this.state.errorInfo) {
        //     // this.props.push()
        //     return <Page500
        //         resetErrorBoundary={this.resetErrorBoundary}
        //     />;
        // }
        return this.props.children;
    }
}

const mapStateToProps = (state) => {
    return {
        //userData: state.authReducer.user,
        // codeError: state.applicationReducer.codeError,
    }
};
const mapDispatchToProps = (dispatch)=>{
    return {
        // setServerError: (codeError) => dispatch(applicationActions.setServerError(codeError))
    }
};
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(ErrorBoundary);

import React from "react";
import PageError from "./PageError";
import {withTranslation} from "react-i18next";
import * as links from "../../constants/links";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
// import * as applicationActions from "../../_actions/application";
import {connect} from "react-redux";
// import {withStyles} from "@material-ui/core/styles";
// import {CODE_ERROR_500} from "../../constants/constants";

class Page500 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectPage: false
        };
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        if (this.state.redirectPage === false) {
            this.setState({
                redirectPage: true
            })
            this.props.history.push(links.PAGE500);
            if (typeof this.props.resetErrorBoundary === 'function') {
                this.props.resetErrorBoundary();
            }
            // this.props.resetErrorBoundary();
        }
        return <PageError resetErrorBoundary={this.props.resetErrorBoundary} code={500} goToHome={true} title={this.props.t("error.p500.title")} />;
    }

}

const mapStateToProps = (state) => {
    return {
        userData: state.authReducer.user,
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
    withRouter,
    withTranslation()
)(Page500);
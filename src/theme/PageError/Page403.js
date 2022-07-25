import React from "react";
import PageError from "./PageError";
import {withTranslation} from "react-i18next";
import PropTypes from "prop-types";
import {compose} from "redux";
import {connect} from "react-redux";

class Page403 extends React.Component {
    // constructor(props) {
    //     super(props);
    // }
    componentDidMount() {
        // this.props.setServerError(null);
    }
    render() {
        return <PageError code={403} goToHome={true} title={this.props.t("error.p403.title")} />;
    }

}

const mapStateToProps = (state) => {
    return {
        codeError: state.authReducer.codeError
    }
};

const mapDispatchToProps = (dispatch)=>{
    return {
        // setServerError: (codeError) => dispatch(applicationActions.setServerError(codeError))
    }
};


Page403.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withTranslation()
)(Page403);

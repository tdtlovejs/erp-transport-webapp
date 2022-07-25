import React from "react";
import {withTranslation} from "react-i18next";
import PageError from "./PageError";

class Page404 extends React.Component {
    render() {
        return <PageError code={404} goToHome={true} title={this.props.t("error.p404.title")}/>;
    }
}

export default withTranslation()(Page404);
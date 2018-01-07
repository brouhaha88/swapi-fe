import React from 'react';
import { connect } from 'react-redux';

import Section from 'grommet/components/Section';

import {
  getRouterLocationPathname,
  getTypeFromRouterLocationPathname,
  getIdFromRouterLocationPathname,
} from '../../../../../../ducks/router';
import { getResourceFromResourcesByType } from '../../../../../../ducks/resources';

class Resource extends React.Component {
  render() {
    return (
      <Section>
        {this.props.locationPathname}
      </Section>
    );
  }
}

const mapStateToProps = (state) => {
  const activeType = getTypeFromRouterLocationPathname(state);
  const activeId = atob(getIdFromRouterLocationPathname(state));

  return {
    locationPathname: getRouterLocationPathname(state),
    resource: getResourceFromResourcesByType(state, activeType, activeId),
  };
};

const ConnectedResource = connect(mapStateToProps, () => ({}))(Resource);

export default ConnectedResource;

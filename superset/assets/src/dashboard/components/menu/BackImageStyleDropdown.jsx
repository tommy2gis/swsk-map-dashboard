/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { t } from '@superset-ui/translation';

import PopoverDropdown from './PopoverDropdown';

const propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const dropdownOptions = Array(17).fill(0)
  .map((e, i) => {return {value:'border'+(i+1),label:'背景'+(i+1)}});

export default class BackImageStyleDropdown extends React.PureComponent {
  render() {
    const { id, value, onChange } = this.props;

    return (
      <PopoverDropdown
        id={id}
        options={dropdownOptions}
        value={value}
        onChange={onChange}
      />
    );
  }
}

BackImageStyleDropdown.propTypes = propTypes;

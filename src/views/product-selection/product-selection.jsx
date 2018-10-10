import React from 'react';
import cx from 'classnames';

import { translate } from '../../services';

import styles from './product-selection.css';
import global from '../../../css/global.css';

import TextInput from '../../components/text-input/text-input';
import NothingFoundCallSupport from '../../components/nothing-found-call-support/nothing-found-call-support';

export default ({
  search,
  goTo,
  callSupport,
  updateSearch,
  searchResult,
  openAnnotation,
  trimDescription,
}) => (
  <div className={cx(styles.ProductSelection, global.BackgroundImage)}>
    <div className={cx(styles.Header, search && styles.hasSearchResults)}>{translate('ProductSelectionTitle')}</div>

    <div className={cx(styles.SearchBar, search && styles.hasSearchResults)}>
      <TextInput
        searchButton
        value={search}
        setValue={updateSearch}
        className={styles.SelectProductInput}
        placeholder="SearchPlaceholder"
      />
    </div>

    <div className={cx(styles.Annotations, search && styles.hasSearchResults)}>

      {searchResult.map(annotation => (
        <div
          className={styles.Annotation}
          key={annotation.id}
        >
          <div className={styles.Title} onClick={() => openAnnotation(annotation.id)}>
            {annotation.title}
          </div>
          <div className={styles.Description}>
            {trimDescription(annotation.description)}
          </div>
        </div>
      ))}

      <div className={styles.Filler} />
      <NothingFoundCallSupport callSupport={callSupport} />
    </div>
  </div>
);

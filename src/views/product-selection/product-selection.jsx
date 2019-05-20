import React from 'react';
import cx from 'classnames';

import styles from './product-selection.scss';
import global from '../../../css/global.scss';

import { translate } from '../../services';
import {
  Tag,
  TextInput,
  Button,
  NothingFoundCallSupport,
} from '../../components';

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
    <div className={cx(styles.Header, search && styles.hasSearchResults)}>
      {translate('ProductSelectionTitle')}
    </div>

    <Button
      className={cx(styles.BackButton, search && styles.isHidden)}
      icon="close"
      onClick={() => goTo('/')}
    />

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
          onClick={() => openAnnotation(annotation.id)}
        >
          <div className={styles.Title}>{annotation.title}</div>
          <div className={styles.Tags}>
            {[
              ...(annotation.productTags || []),
              ...(annotation.tags || []),
            ].map(tag => (
              <Tag label={tag} className={styles.Tag} key={tag} noDelete />
            ))}
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

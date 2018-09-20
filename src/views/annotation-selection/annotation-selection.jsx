import React from 'react';
import cx from 'classnames';

import { translate } from '../../services';

import styles from './annotation-selection.css';
import global from '../../../css/global.css';

import HeaderBar from '../../components/header-bar/header-bar';
import TextInput from '../../components/text-input/text-input';
import Button from '../../components/button/button';
import Tag from '../../components/tag/tag';
import NothingFoundCallSupport from '../../components/nothing-found-call-support/nothing-found-call-support';

export default ({
  backPath,
  search,
  updateSearch,
  searchResult,
  callSupport,
  openAnnotation,
}) => (
  <div className={cx(styles.AnnotationSelection, global.BackgroundImage)}>
    <HeaderBar goBack title="AnnotationSelectionTitle" />
    <div className={styles.AnnotationSelectionContent}>
      <TextInput
        deleteButton
        value={search}
        setValue={updateSearch}
        className={styles.SelectProductInput}
        placeholder="SearchPlaceholder"
      />

      <div className={styles.Annotations}>
        {searchResult.map(annotation => (
          <div className={styles.Annotation} key={annotation.id}>
            <div className={styles.Title}>{annotation.title}</div>
            <div className={styles.Tags}>
              {annotation.tags &&
                annotation.tags.map(tag => <Tag key={tag} label={tag} />)}
            </div>
            <div className={styles.Description}>{annotation.description}</div>
            <Button
              icon="next"
              small
              className={styles.SelectButton}
              onClick={() => openAnnotation(annotation.id)}
            />
          </div>
        ))}

        <NothingFoundCallSupport callSupport={callSupport} />
      </div>
    </div>
  </div>
);

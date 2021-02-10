import React from 'react';

import { InlineField, Select } from '@grafana/ui';

import Datasource from '../../datasource';
import { AzureMonitorQuery } from '../../types';
import MetricNamespaceField from './MetricNamespaceField';
import NamespaceField from './NamespaceField';
import ResourceGroupsField from './ResourceGroupsField';
import ResourceNameField from './ResourceNameField';
import MetricNameField from './MetricNameField';
import AggregationField from './AggregationField';
import { useMetricsMetadata } from '../metrics';
import TimeGrainField from './TimeGrainField';
import DimensionFields from './DimensionFields';

interface MetricsQueryEditorProps {
  query: AzureMonitorQuery;
  datasource: Datasource;
  subscriptionId: string;
  onChange: (newQuery: AzureMonitorQuery) => void;
}

const noop = (...args: any) => console.log(...args);
const opt = (value: string) => ({ value, label: value });

const labelWidth = 16;

const MetricsQueryEditor: React.FC<MetricsQueryEditorProps> = ({ query, datasource, subscriptionId, onChange }) => {
  const metricsMetadata = useMetricsMetadata(datasource, query, subscriptionId, onChange);

  // Single dynamic onChange function might be a bit unwieldly. Let's see how it goes.
  // This type magic ensures its only ever called with valid key/value pairs of the azureMonitor object
  function onFieldChange<Key extends keyof AzureMonitorQuery['azureMonitor']>(
    field: Key,
    value: AzureMonitorQuery['azureMonitor'][Key]
  ) {
    console.log('onFieldChange', { field, value });
    // TODO: when fields change, we actually need to unset all the "lower" fields that depend on this as well
    onChange({
      ...query,
      azureMonitor: {
        ...query.azureMonitor,
        [field]: value,
      },
    });
  }

  return (
    <>
      <InlineField label="Subscription" labelWidth={labelWidth}>
        <Select value={opt(query.subscription)} onChange={noop} options={[]} />
      </InlineField>

      <ResourceGroupsField
        query={query}
        datasource={datasource}
        subscriptionId={subscriptionId}
        onChange={onFieldChange}
      />

      <NamespaceField query={query} datasource={datasource} subscriptionId={subscriptionId} onChange={onFieldChange} />

      <ResourceNameField
        query={query}
        datasource={datasource}
        subscriptionId={subscriptionId}
        onChange={onFieldChange}
      />

      <MetricNamespaceField
        query={query}
        datasource={datasource}
        subscriptionId={subscriptionId}
        onChange={onFieldChange}
      />

      <MetricNameField query={query} datasource={datasource} subscriptionId={subscriptionId} onChange={onFieldChange} />

      <AggregationField
        query={query}
        datasource={datasource}
        subscriptionId={subscriptionId}
        onChange={onFieldChange}
        aggregationOptions={metricsMetadata?.aggOptions ?? []}
      />

      <TimeGrainField
        query={query}
        datasource={datasource}
        subscriptionId={subscriptionId}
        onChange={onFieldChange}
        timeGrainOptions={metricsMetadata?.timeGrains ?? []}
      />

      <DimensionFields
        query={query}
        datasource={datasource}
        subscriptionId={subscriptionId}
        onChange={onFieldChange}
        dimensionOptions={metricsMetadata?.dimensions ?? []}
      />
    </>
  );
};

export default MetricsQueryEditor;

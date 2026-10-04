Source: https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging
Title: Agent Platform audit logging information  |  Gemini Enterprise Agent Platform  |  Google Cloud Documentation
Fetched: 2026-10-04T09:35:23.413Z

[Skip to main content](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#main-content)

[![Google Cloud Documentation](https://www.gstatic.com/devrel-devsite/prod/vfdb441d2e08dbd9d3e48d8cd72b242388a87bcf7626bf5fb9df50c2bdd4a70fd/clouddocs/images/lockup_full_color.svg)](https://docs.cloud.google.com/)

`/`

[Console](https://console.cloud.google.com/)Language

- [English](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging)
- [Deutsch](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging?hl=de)
- [Español – América Latina](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging?hl=es-419)
- [Français](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging?hl=fr)
- [Indonesia](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging?hl=id)
- [Italiano](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging?hl=it)
- [Português – Brasil](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging?hl=pt-br)
- [עברית](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging?hl=he)
- [中文 – 简体](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging?hl=zh-cn)
- [中文 – 繁體](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging?hl=zh-tw)
- [日本語](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging?hl=ja)
- [한국어](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging?hl=ko)

Sign in

[![](https://www.gstatic.com/images/branding/productlogos/gemini_2025/v1/192px.svg)](https://docs.cloud.google.com/gemini-enterprise-agent-platform)

- [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform)

[Start free](https://console.cloud.google.com/freetrial)

- On this page
- [Overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#overview)
- [Available audit logs](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#available-logs)
- [Audited operations](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#audited_operations)
- [Audit log format](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#audit_log_format)
  - [Log name](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#log_name)
  - [Service name](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#service_name)
  - [Resource types](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#resource_types)
  - [Caller identities](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#caller-identities)
- [Enable audit logging](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#enabling_audit_logging)
- [Permissions and roles](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#audit_log_permissions)
- [View logs](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#viewing_logs)
- [Route audit logs](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#exporting_audit_logs)
- [Pricing](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#pricing)

- [Home](https://docs.cloud.google.com/)
- [Documentation](https://docs.cloud.google.com/docs)
- [AI and ML](https://docs.cloud.google.com/docs/ai-ml)
- [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform)
- [Models](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models)



 Send feedback



# Agent Platform audit logging information    Stay organized with collections      Save and categorize content based on your preferences.

- On this page
- [Overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#overview)
- [Available audit logs](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#available-logs)
- [Audited operations](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#audited_operations)
- [Audit log format](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#audit_log_format)
  - [Log name](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#log_name)
  - [Service name](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#service_name)
  - [Resource types](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#resource_types)
  - [Caller identities](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#caller-identities)
- [Enable audit logging](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#enabling_audit_logging)
- [Permissions and roles](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#audit_log_permissions)
- [View logs](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#viewing_logs)
- [Route audit logs](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#exporting_audit_logs)
- [Pricing](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/audit-logging#pricing)

This document describes the audit logs created by Gemini Enterprise Agent Platform as part of
[Cloud Audit Logs](https://docs.cloud.google.com/logging/docs/audit).

## Overview

Google Cloud services write audit logs to help you answer the questions, "Who
did what, where, and when?" within your Google Cloud resources.

Your Google Cloud projects contain only the audit logs for resources that are
directly within the Google Cloud project. Other Google Cloud resources,
such as folders, organizations, and billing accounts, contain the audit logs for
the entity itself.

For a general overview of Cloud Audit Logs, see
[Cloud Audit Logs overview](https://docs.cloud.google.com/logging/docs/audit). For a deeper understanding
of the audit log format, see
[Understand audit logs](https://docs.cloud.google.com/logging/docs/audit/understanding-audit-logs).

## Available audit logs

The following types of audit logs are available for Agent Platform:

- Admin Activity audit logs



Includes "admin write" operations that write metadata or configuration
information.



You can't disable Admin Activity audit logs.


- Data Access audit logs



Includes "admin read" operations that read metadata or configuration
information.

Also includes "data read" and "data write" operations that
read or write user-provided data.




To receive Data Access audit logs, you must
[explicitly enable](https://docs.cloud.google.com/logging/docs/audit/configure-data-access#config-console-enable) them.


- System Event audit logs



Identifies automated Google Cloud actions that modify the
configuration of resources.



You can't disable System Event audit logs.



For fuller descriptions of the audit log types, see
[Types of audit logs](https://docs.cloud.google.com/logging/docs/audit#types).

## Audited operations

The following table summarizes which API operations correspond to each audit log
type in Agent Platform:

| Audit logs category | Agent Platform operations |
| --- | --- |
| Admin Activity audit logs | batchPredictionJobs.cancel<br>batchPredictionJobs.create<br>batchPredictionJobs.delete<br>customJobs.cancel<br>customJobs.create<br>customJobs.delete<br>dataLabelingJobs.cancel<br>dataLabelingJobs.create<br>dataLabelingJobs.delete<br>datasets.create<br>datasets.delete<br>datasets.export<br>datasets.import<br>datasets.patch<br>endpoints.create<br>endpoints.delete<br>endpoints.deployModel<br>endpoints.patch<br>endpoints.undeployModel<br>featurestores.create<br>featurestores.delete<br>featurestores.patch<br>featurestores.setIamPolicy<br>featurestores.entityTypes.create<br>featurestores.entityTypes.delete<br>featurestores.entityTypes.patch<br>featurestores.entityTypes.setIamPolicy<br>featurestores.entityTypes.features.batchCreate<br>featurestores.entityTypes.features.create<br>featurestores.entityTypes.features.delete<br>featurestores.entityTypes.features.patch<br>hyperparameterTuningJobs.cancel<br>hyperparameterTuningJobs.create<br>hyperparameterTuningJobs.delete<br>indexEndpoints.create<br>indexEndpoints.delete<br>indexEndpoints.deployIndex<br>indexEndpoints.mutateDeployedIndex<br>indexEndpoints.patch<br>indexEndpoints.undeployIndex<br>memories.create<br>memories.delete<br>memories.generate<br>memories.purge<br>memories.update<br>memoryRevisions.rollback<br>metadataStores.create<br>metadataStores.delete<br>metadataStores.artifacts.create<br>metadataStores.artifacts.delete<br>metadataStores.artifacts.patch<br>metadataStores.artifacts.purge<br>metadataStores.contexts.addContextArtifactsAndExecutions<br>metadataStores.contexts.addContextChildren<br>metadataStores.contexts.create<br>metadataStores.contexts.delete<br>metadataStores.contexts.patch<br>metadataStores.contexts.purge<br>metadataStores.executions.addExecutionEvents<br>metadataStores.executions.create<br>metadataStores.executions.delete<br>metadataStores.executions.patch<br>metadataStores.executions.purge<br>metadataStores.metadataSchemas.create<br>migratableResources.batchMigrate<br>modelDeploymentMonitoringJobs.create<br>modelDeploymentMonitoringJobs.delete<br>modelDeploymentMonitoringJobs.patch<br>modelDeploymentMonitoringJobs.pause<br>modelDeploymentMonitoringJobs.resume<br>modelDevelopmentClusters.create<br>modelDevelopmentClusters.delete<br>modelDevelopmentClusters.get<br>modelDevelopmentClusters.list<br>modelDevelopmentClusters.update<br>models.delete<br>models.deleteVersion<br>models.export<br>models.mergeVersionAliases<br>models.patch<br>models.upload<br>models.evaluations.import<br>models.evaluations.slices.batchImport<br>modelMonitors.create<br>modelMonitors.delete<br>modelMonitors.update<br>modelMonitoringJobs.create<br>modelMonitoringJobs.delete<br>operations.cancel<br>pipelineJobs.cancel<br>pipelineJobs.create<br>pipelineJobs.delete<br>ragCorpora.create<br>ragCorpora.delete<br>ragEngineConfigs.update<br>sandboxEnvironments.create<br>sandboxEnvironments.delete<br>sandboxEnvironments.snapshot<br>sandboxEnvironmentSnapshots.delete<br>sandboxEnvironmentTemplates.create<br>sandboxEnvironmentTemplates.delete<br>schedules.create<br>schedules.delete<br>schedules.update<br>specialistPools.create<br>specialistPools.delete<br>specialistPools.patch<br>studies.create<br>studies.delete<br>studies.trials.addTrialMeasurement<br>studies.trials.complete<br>studies.trials.create<br>studies.trials.delete<br>studies.trials.stop<br>studies.trials.suggest<br>tensorboards.create<br>tensorboards.delete<br>tensorboards.patch<br>tensorboards.experiments.create<br>tensorboards.experiments.delete<br>tensorboards.experiments.patch<br>tensorboards.experiments.write<br>tensorboards.experiments.runs.batchCreate<br>tensorboards.experiments.runs.create<br>tensorboards.experiments.runs.delete<br>tensorboards.experiments.runs.patch<br>tensorboards.experiments.runs.write<br>tensorboards.experiments.runs.timeSeries.batchCreate<br>tensorboards.experiments.runs.timeSeries.create<br>tensorboards.experiments.runs.timeSeries.delete<br>tensorboards.experiments.runs.timeSeries.patch<br>trainingPipelines.cancel<br>trainingPipelines.create<br>trainingPipelines.delete<br>tuningJobs.cancel<br>tuningJobs.create<br>deploymentResourcePool.create<br>deploymentResourcePool.delete<br>semanticGovernancePolicies.create<br>semanticGovernancePolicies.update<br>semanticGovernancePolicies.delete |
| Data Access (ADMIN\_READ) audit logs | batchPredictionJobs.get<br>batchPredictionJobs.list<br>customJobs.get<br>customJobs.list<br>dataLabelingJobs.get<br>dataLabelingJobs.list<br>datasets.get<br>datasets.list<br>datasets.annotationSpecs.get<br>datasets.annotations.list<br>datasets.savedQueries.list<br>endpoints.get<br>endpoints.list<br>featurestores.get<br>featurestores.getIamPolicy<br>featurestores.list<br>featurestores.searchFeatures<br>featurestores.entityTypes.get<br>featurestores.entityTypes.getIamPolicy<br>featurestores.entityTypes.list<br>featurestores.entityTypes.features.get<br>featurestores.entityTypes.features.list<br>hyperparameterTuningJobs.get<br>hyperparameterTuningJobs.list<br>indexEndpoints.get<br>indexEndpoints.list<br>indexes.get<br>indexes.delete<br>memories.get<br>memories.list<br>memoryRevisions.get<br>memoryRevisions.list<br>metadataStores.get<br>metadataStores.list<br>metadataStores.artifacts.get<br>metadataStores.artifacts.list<br>metadataStores.artifacts.queryArtifactLineageSubgraph<br>metadataStores.contexts.get<br>metadataStores.contexts.list<br>metadataStores.contexts.queryContextLineageSubgraph<br>metadataStores.executions.get<br>metadataStores.executions.list<br>metadataStores.executions.queryExecutionInputsAndOutputs<br>metadataStores.metadataSchemas.get<br>metadataStores.metadataSchemas.list<br>migratableResources.search<br>modelDeploymentMonitoringJobs.get<br>modelDeploymentMonitoringJobs.list<br>models.get<br>models.list<br>models.listVersions<br>models.evaluations.get<br>models.evaluations.list<br>models.evaluations.slices.get<br>models.evaluations.slices.list<br>modelMonitors.get<br>modelMonitors.list<br>modelMonitoringJobs.get<br>modelMonitoringJobs.list<br>pipelineJobs.get<br>pipelineJobs.list<br>ragCorpora.get<br>ragCorpora.list<br>ragEngineConfigs.get<br>sandboxEnvironments.get<br>sandboxEnvironments.list<br>sandboxEnvironmentSnapshots.get<br>sandboxEnvironmentSnapshots.list<br>sandboxEnvironmentTemplates.get<br>sandboxEnvironmentTemplates.list<br>schedules.get<br>schedules.list<br>specialistPools.get<br>specialistPools.list<br>studies.get<br>studies.list<br>studies.lookup<br>studies.trials.checkTrialEarlyStoppingState<br>studies.trials.get<br>studies.trials.list<br>studies.trials.listOptimalTrials<br>tensorboards.get<br>tensorboards.list<br>tensorboards.experiments.get<br>tensorboards.experiments.list<br>tensorboards.experiments.runs.get<br>tensorboards.experiments.runs.list<br>tensorboards.experiments.runs.timeSeries.batchRead<br>tensorboards.experiments.runs.timeSeries.exportTensorboardTimeSeries<br>tensorboards.experiments.runs.timeSeries.get<br>tensorboards.experiments.runs.timeSeries.list<br>tensorboards.experiments.runs.timeSeries.read<br>tensorboards.experiments.runs.timeSeries.readBlobData<br>trainingPipelines.get<br>trainingPipelines.list<br>tuningJobs.get<br>tuningJobs.list<br>deploymentResourcePool.get<br>deploymentResourcePool.list<br>deploymentResourcePool.queryDeployedModels<br>semanticGovernancePolicies.list<br>semanticGovernancePolicies.get |
| Data Access (DATA\_READ) audit logs | datasets.dataItems.list<br>endpoints.explain<br>endpoints.predict<br>endpoints.predictLongRunning<br>endpoints.rawPredict<br>featurestores.batchReadFeatureValues<br>featurestores.entityTypes.exportFeatureValues<br>featurestores.entityTypes.readFeatureValues<br>featurestores.entityTypes.streamingReadFeatureValues<br>indexEndpoints.findNeighbors<br>memories.retrieve<br>modelDeploymentMonitoringJobs.searchModelDeploymentMonitoringStatsAnomalies<br>modelMonitors.searchModelMonitoringAlerts<br>modelMonitors.searchModelMonitoringStats<br>onlineEvaluators.get<br>onlineEvaluators.list<br>ragFiles.get<br>ragFiles.list<br>sessions.get<br>sessions.list<br>sessionEvents.list |
| Data Access (DATA\_WRITE) audit logs | featurestores.entityTypes.importFeatureValues<br>indexes.create<br>indexes.patch<br>indexes.removeDatapoints<br>indexes.upsertDatapoints<br>onlineEvaluators.create<br>onlineEvaluators.update<br>onlineEvaluators.delete<br>ragFiles.delete<br>ragFiles.import<br>ragFiles.upload<br>sandboxEnvironments.execute<br>sessions.create<br>sessions.update<br>sessions.delete<br>sessionEvents.append |
| System Event audit logs | InstanceVerification.LogEvidence |

## Audit log format

Audit log entries include the following objects:

- The log entry itself, which is an object of type [`LogEntry`](https://docs.cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry).
Useful fields include the following:

  - The `logName` contains the resource ID and audit log type. The resource
    is a project, folder, organization, or billing account.
  - The `resource` contains the target of the audited operation.
  - The `timeStamp` contains the time of the audited operation.
  - The `protoPayload` contains the audited information.
- The audit logging data, which is an [`AuditLog`](https://docs.cloud.google.com/logging/docs/reference/audit/auditlog/rest/Shared.Types/AuditLog) object held in
the `protoPayload` field of the log entry.

  - The `@type` field is set to `"type.googleapis.com/google.cloud.audit.AuditLog"`.
  - The `serviceName` field identifies the service that wrote the
    audit log. The format of this field is service specific.
- Optional service-specific audit information, which is a service-specific
object. For earlier integrations, this object is held in the `serviceData`
field of the `AuditLog` object; later integrations use the `metadata` field.


For other fields in these objects, and how to interpret them, review
[Understand audit logs](https://docs.cloud.google.com/logging/docs/audit/understanding-audit-logs).

### Log name

Cloud Audit Logs log names include resource identifiers indicating the
Google Cloud project or other Google Cloud entity that owns the audit
logs, and whether the log contains Admin Activity, Data Access, Policy Denied,
or System Event audit logging data.

The following are the audit log names, including variables for the resource
identifiers:

```
   projects/PROJECT_ID/logs/cloudaudit.googleapis.com%2Factivity
   projects/PROJECT_ID/logs/cloudaudit.googleapis.com%2Fdata_access
   projects/PROJECT_ID/logs/cloudaudit.googleapis.com%2Fsystem_event
   projects/PROJECT_ID/logs/cloudaudit.googleapis.com%2Fpolicy

   folders/FOLDER_ID/logs/cloudaudit.googleapis.com%2Factivity
   folders/FOLDER_ID/logs/cloudaudit.googleapis.com%2Fdata_access
   folders/FOLDER_ID/logs/cloudaudit.googleapis.com%2Fsystem_event
   folders/FOLDER_ID/logs/cloudaudit.googleapis.com%2Fpolicy

   billingAccounts/BILLING_ACCOUNT_ID/logs/cloudaudit.googleapis.com%2Factivity
   billingAccounts/BILLING_ACCOUNT_ID/logs/cloudaudit.googleapis.com%2Fdata_access
   billingAccounts/BILLING_ACCOUNT_ID/logs/cloudaudit.googleapis.com%2Fsystem_event
   billingAccounts/BILLING_ACCOUNT_ID/logs/cloudaudit.googleapis.com%2Fpolicy

   organizations/ORGANIZATION_ID/logs/cloudaudit.googleapis.com%2Factivity
   organizations/ORGANIZATION_ID/logs/cloudaudit.googleapis.com%2Fdata_access
   organizations/ORGANIZATION_ID/logs/cloudaudit.googleapis.com%2Fsystem_event
   organizations/ORGANIZATION_ID/logs/cloudaudit.googleapis.com%2Fpolicy
```

### Service name

Agent Platform audit logs use the service name
`aiplatform.googleapis.com`.

For a list of all the Cloud Logging API service names and their corresponding
monitored resource type, see
[Map services to resources](https://docs.cloud.google.com/logging/docs/api/v2/resource-list#service-names).

### Resource types

Agent Platform audit logs use the resource type
`audited_resource` for all audit logs.

For a list of all the Cloud Logging monitored resource types and descriptive
information, see
[Monitored resource types](https://docs.cloud.google.com/logging/docs/api/v2/resource-list#resource-types).

### Caller identities

The IP address of the caller is held in the `RequestMetadata.caller_ip` field of
the [`AuditLog`](https://docs.cloud.google.com/logging/docs/reference/audit/auditlog/rest/Shared.Types/AuditLog) object. Logging might redact certain
caller identities and IP addresses.

For information about what information is redacted in audit logs, see
[Caller identities in audit logs](https://docs.cloud.google.com/logging/docs/audit#user-id).

## Enable audit logging

System Event audit logs are always enabled; you can't disable them.

Admin Activity audit logs are always enabled; you can't disable them.

Data Access audit logs are disabled by default and aren't written unless
explicitly enabled (the exception is Data Access audit logs for
BigQuery, which can't be disabled).

For information about enabling some or all of your Data Access audit logs, see
[Enable Data Access audit logs](https://docs.cloud.google.com/logging/docs/audit/configure-data-access).

## Permissions and roles

[IAM](https://docs.cloud.google.com/iam/docs) permissions and roles determine your ability to
access audit logs data in Google Cloud resources.

When deciding which
[Logging-specific permissions and roles](https://docs.cloud.google.com/logging/docs/access-control#permissions_and_roles)
apply to your use case, consider the following:

- The Logs Viewer role (`roles/logging.viewer`) gives you read-only access to
Admin Activity, Policy Denied, and System Event audit logs. If you have just
this role, you cannot view Data Access audit logs that are in the
`_Default` bucket.

- The Private Logs Viewer role`(roles/logging.privateLogViewer`) includes the
permissions contained in `roles/logging.viewer`, plus the ability to read
Data Access audit logs in the `_Default` bucket.

Note that if these private logs are stored in user-defined buckets, then any
user who has permissions to read logs in those buckets can read the private
logs. For more information about log buckets, see
[Routing and storage overview](https://docs.cloud.google.com/logging/docs/routing/overview).


For more information about the IAM permissions and roles that
apply to audit logs data, see
[Access control with IAM](https://docs.cloud.google.com/logging/docs/access-control).

## View logs

You can query for all audit logs or you can query for logs by their
audit log name. The audit log name includes the
[resource identifier](https://docs.cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects)
of the Google Cloud project, folder, billing account, or
organization for which you want to view audit logging information.
Your queries can specify indexed [`LogEntry`](https://docs.cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry) fields.
For more information about querying your logs, see
[Build queries in the Logs Explorer](https://docs.cloud.google.com/logging/docs/view/building-queries)

The Logs Explorer lets you view filter individual log entries. If you want
to use SQL to analyze groups of log entries, then use the **Log Analytics**
page. For more information, see:

- [Query and view logs in Observability Analytics](https://docs.cloud.google.com/logging/docs/analyze/query-and-view).
- [Sample queries for security insights](https://docs.cloud.google.com/logging/docs/analyze/analyze-audit-logs).
- [Chart query results](https://docs.cloud.google.com/logging/docs/analyze/charts).

Most audit logs can be viewed in Cloud Logging by using the
Google Cloud console, the Google Cloud CLI, or the Logging API.
However, for audit logs related to billing, you can only use the
Google Cloud CLI or the Logging API.

### Console

In the Google Cloud console, you can use the Logs Explorer
to retrieve your audit log entries for your Google Cloud project, folder,
or organization:

1. In the Google Cloud console, go to the
    segment **Logs Explorer** page:


[Go to **Logs Explorer**](https://console.cloud.google.com/logs/query)



If you use the search bar to find this page, then select the result whose subheading is
**Logging**.

2. Select an existing Google Cloud project, folder, or organization.

3. To display all audit logs, enter either of the following queries
into the query-editor field, and then click **Run query**:




```
logName:"cloudaudit.googleapis.com"
```





```
protoPayload."@type"="type.googleapis.com/google.cloud.audit.AuditLog"
```

4. To display the audit logs for a specific resource and audit log type,
in the **Query builder** pane, do the following:


   - In **Resource type**, select the Google Cloud resource whose
     audit logs you want to see.

   - In **Log name**, select the audit log type that you want to see:

     - For Admin Activity audit logs, select **activity**.
     - For Data Access audit logs, select **data\_access**.
     - For System Event audit logs, select **system\_event**.
     - For Policy Denied audit logs, select **policy**.
   - Click **Run query**.


If you don't see these options, then there aren't any audit logs of
that type available in the Google Cloud project, folder, or
organization.

If you're experiencing issues when trying to view logs in the
Logs Explorer, see the
[troubleshooting](https://docs.cloud.google.com/logging/docs/view/logs-explorer-interface#troubleshooting)
information.

For more information about querying by using the Logs Explorer, see
[Build queries in the Logs Explorer](https://docs.cloud.google.com/logging/docs/view/building-queries).

### gcloud

The Google Cloud CLI provides a command-line interface to the
Logging API. Supply a valid resource identifier in each of the log
names. For example, if your query includes a PROJECT\_ID, then the
project identifier you supply must refer to the currently selected
Google Cloud project.

To read your Google Cloud project-level audit log entries, run
the following command:

```
gcloud logging read "logName : projects/PROJECT_ID/logs/cloudaudit.googleapis.com" \
    --project=PROJECT_ID
```

To read your folder-level audit log entries, run the following command:

```
gcloud logging read "logName : folders/FOLDER_ID/logs/cloudaudit.googleapis.com" \
    --folder=FOLDER_ID
```

To read your organization-level audit log entries, run the following
command:

```
gcloud logging read "logName : organizations/ORGANIZATION_ID/logs/cloudaudit.googleapis.com" \
    --organization=ORGANIZATION_ID
```

To read your Cloud Billing account-level audit log entries, run the following command:

```
gcloud logging read "logName : billingAccounts/BILLING_ACCOUNT_ID/logs/cloudaudit.googleapis.com" \
    --billing-account=BILLING_ACCOUNT_ID
```

Add the [`--freshness` flag](https://docs.cloud.google.com/sdk/gcloud/reference/logging/read#--freshness)
to your command to read logs that are more than 1 day old.

For more information about using the gcloud CLI, see
[`gcloud logging read`](https://docs.cloud.google.com/sdk/gcloud/reference/logging/read).

### REST

When building your queries, supply a valid resource identifier in each of
the log names. For example, if your query includes a PROJECT\_ID,
then the project identifier you supply must refer to the currently selected
Google Cloud project.

For example, to use the Logging API to view your project-level
audit log entries, do the following:

1. Go to the **Try this API** section in the documentation for the
[`entries.list`](https://docs.cloud.google.com/logging/docs/reference/v2/rest/v2/entries/list) method.

2. Put the following into the **Request body** part of the **Try this**
**API** form. Clicking this [prepopulated form](https://docs.cloud.google.com/logging/docs/reference/v2/rest/v2/entries/list?apix_params=%7B%22resource%22%3A%7B%22resourceNames%22%3A%5B%22projects%2F%5BPROJECT_ID%5D%22%5D%2C%22pageSize%22%3A5%2C%22filter%22%3A%22logName%3D(projects%2F%5BPROJECT_ID%5D%2Flogs%2Fcloudaudit.googleapis.com%252Factivity%20OR%20projects%2F%5BPROJECT_ID%5D%2Flogs%2Fcloudaudit.googleapis.com%252Fsystem_events%20OR%20projects%2F%5BPROJECT_ID%5D%2Flogs%2Fcloudaudit.googleapis.com%252Fdata_access)%22%7D%7D)
automatically fills the request body, but you need to supply a valid
PROJECT\_ID in each of the log names.




```
{
     "resourceNames": [\
       "projects/PROJECT_ID"\
     ],
     "pageSize": 5,
     "filter": "logName : projects/PROJECT_ID/logs/cloudaudit.googleapis.com"
}
```

3. Click **Execute**.


## Route audit logs

You can [route audit logs](https://docs.cloud.google.com/logging/docs/routing/overview) to supported
destinations in the same way that you can route other kinds of logs. Here are
some reasons you might want to route your audit logs:

- To keep audit logs for a longer period of time or to use more powerful
search capabilities, you can route copies of your audit logs to
Cloud Storage, BigQuery, or Pub/Sub. Using
Pub/Sub, you can route to other applications, other
repositories, and to third parties.

- To manage your audit logs across an entire organization, you can create
[aggregated sinks](https://docs.cloud.google.com/logging/docs/export/aggregated_sinks) that can
route logs from any or all Google Cloud projects in the organization.


- If your enabled Data Access audit logs are pushing your
Google Cloud projects over your log allotments, you can create sinks that
exclude the Data Access audit logs from Logging.

For instructions about routing logs, see
[Route logs to supported destinations](https://docs.cloud.google.com/logging/docs/export/configure_export_v2).

## Pricing

For more information about pricing, see the Cloud Logging sections in the
[Google Cloud Observability pricing](https://cloud.google.com/products/observability/pricing) page.



 Send feedback



Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-10-01 UTC.


Need to tell us more?






\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Hard to understand","hardToUnderstand","thumb-down"\],\["Incorrect information or sample code","incorrectInformationOrSampleCode","thumb-down"\],\["Missing the information/samples I need","missingTheInformationSamplesINeed","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-10-01 UTC."\],\[\],\[\]\]
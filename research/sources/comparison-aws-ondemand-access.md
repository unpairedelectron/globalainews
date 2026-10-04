Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html
Title: Purchasing On-Demand Instances for Amazon EC2 - Amazon Elastic Compute Cloud
Fetched: 2026-10-04T09:57:49.365Z

## Select your cookie preferences

We use essential cookies and similar tools that are necessary to provide our site and services. We use performance cookies to collect anonymous statistics, so we can understand how customers use our site and make improvements. Essential cookies cannot be deactivated, but you can choose “Customize” or “Decline” to decline performance cookies.

If you agree, AWS and approved third parties will also use cookies to provide useful site features, remember your preferences, and display relevant content, including relevant advertising. To accept or decline all non-essential cookies, choose “Accept” or “Decline.” To make more detailed choices, choose “Customize.”

AcceptDeclineCustomize

## Customize cookie preferences

We use cookies and similar tools (collectively, "cookies") for the following purposes.

### Essential

Essential cookies are necessary to provide our site and services and cannot be deactivated. They are usually set in response to your actions on the site, such as setting your privacy preferences, signing in, or filling in forms.

Allowed

### Performance

Performance cookies provide anonymous statistics about how customers navigate our site so we can improve site experience and performance. Approved third parties may perform analytics on our behalf, but they cannot use the data for their own purposes.

Allowed

### Functional

Functional cookies help us provide useful site features, remember your preferences, and display relevant content. Approved third parties may set these cookies to provide certain site features. If you do not allow these cookies, then some or all of these services may not function properly.

Allowed

### Advertising

Advertising cookies may be set through our site by us or our advertising partners and help us deliver relevant marketing content. If you do not allow these cookies, you will experience less relevant advertising.

Allowed

Blocking some types of cookies may impact your experience of our sites. You may review and change your choices at any time by selecting Cookie preferences in the footer of this site. We and selected third-parties use cookies or similar technologies as specified in the [AWS Cookie Notice](https://aws.amazon.com/legal/cookies/).

CancelSave preferences

## Your privacy choices

We and our advertising partners (“we”) may use information we collect from or about you to show you ads on other websites and online services. Under certain laws, this activity is referred to as “cross-context behavioral advertising” or “targeted advertising.”

To opt out of our use of cookies or similar technologies to engage in these activities, select “Opt out of cross-context behavioral ads” and “Save preferences” below. If you clear your browser cookies or visit this site from a different device or browser, you will need to make your selection again. For more information about cookies and how we use them, read our [Cookie Notice](https://aws.amazon.com/legal/cookies/).

Allow cross-context behavioral adsOpt out of cross-context behavioral ads

To opt out of the use of other identifiers, such as contact information, for these activities, fill out the form [here](https://pulse.aws/application/ZRPLWLL6?p=0).

For more information about how AWS handles your information, read the [AWS Privacy Notice](https://aws.amazon.com/privacy/).

CancelSave preferences

## Unable to save cookie preferences

We will only store essential cookies at this time, because we were unable to save your cookie preferences.

If you want to change your cookie preferences, try again later using the link in the AWS console footer, or contact support if the problem persists.

Dismiss

# Purchasing On-Demand Instances for Amazon EC2

[PDF](https://docs.aws.amazon.com/pdfs/AWSEC2/latest/UserGuide/ec2-ug.pdf#ec2-on-demand-instances)

[RSS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/amazon-ec2-release-notes.rss)

[Markdown](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.md "Download Markdown")

Agent SetupUp-to-date AWS docs, tested procedures, and IAM guardrails via a single setup prompt in your AI coding agent.

Focus mode

Purchasing On-Demand Instances for Amazon EC2 - Amazon Elastic Compute Cloud

[Open PDF](https://docs.aws.amazon.com/pdfs/AWSEC2/latest/UserGuide/ec2-ug.pdf#ec2-on-demand-instances "Open PDF")

[On-Demand Instance quotas](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html#ec2-on-demand-instances-limits) [Query the prices of On-Demand Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html#query-aws-price-list)

With On-Demand Instances, you pay for compute capacity by the second with no long-term commitments. You
have full control over the instance's lifecycle—you decide when to launch, stop,
hibernate, start, reboot, or terminate it.

There is no long-term commitment required when you purchase On-Demand Instances. You pay only for the
seconds that your On-Demand Instances are in the `running` state, with a 60-second minimum.
The price per second for a running On-Demand Instance is fixed, and is listed on the [Amazon EC2 Pricing, On-Demand\\
Pricing page](https://aws.amazon.com/ec2/pricing/on-demand/).

We recommend that you use On-Demand Instances for applications with short-term, irregular workloads
that cannot be interrupted.

For significant savings over On-Demand Instances, use [AWS Savings Plans](https://aws.amazon.com/savingsplans/),
[Spot Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html), or
[Reserved Instances for Amazon EC2 overview](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html).

###### Contents

- [On-Demand Instance quotas](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html#ec2-on-demand-instances-limits)

  - [Monitor On-Demand Instance quotas and usage](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html#monitoring-on-demand-limits)

  - [Request a quota increase](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html#vcpu-limits-request-increase)
- [Query the prices of On-Demand Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html#query-aws-price-list)


## On-Demand Instance quotas

There are quotas for the number of running On-Demand Instances per AWS account per Region. On-Demand Instance
quotas are managed in terms of the _number of virtual central_
_processing units (vCPUs)_ that your running On-Demand Instances are using, regardless
of the instance type. Each quota type specifies the maximum number of vCPUs for one or more
instance families.

Your account includes the following quotas for On-Demand Instances. Instances that are in the
pending, stopping, stopped, and hibernated states do not count towards your On-Demand Instance
quotas. Capacity Reservations count toward your On-Demand Instance quotas, even if they are unused.

| Name | Default | Adjustable |
| --- | --- | --- |
| Running On-Demand DL instances | 0 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-6E869C2A) |
| Running On-Demand F instances | 0 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-74FC7D96) |
| Running On-Demand G and VT instances | 0 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-DB2E81BA) |
| Running On-Demand HPC instances | 0 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-F7808C92) |
| Running On-Demand High Memory instances | 0 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-43DA4232) |
| Running On-Demand Inf instances | 0 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-1945791B) |
| Running On-Demand P instances | 0 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-417A185B) |
| Running On-Demand Standard (A, C, D, H, I, M, R, T, Z) instances | 5 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-1216C47A) |
| Running On-Demand Trn instances | 0 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-2C3B7624) |
| Running On-Demand X instances | 0 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-7295265B) |

For information about the different instance families, generations, and sizes, see
the [Amazon EC2 Instance Types Guide](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html).

You can launch any combination of instance types that meet your changing application
needs, as long as the number of vCPUs does not exceed your account quota. For example,
with a Standard instance quota of 256 vCPUs, you could launch 32 `m5.2xlarge`
instances (32 x 8 vCPUs) or 16 `c5.4xlarge` instances (16 x 16 vCPUs). For
more information, see [EC2 On-Demand Instance limits](https://aws.amazon.com/ec2/faqs/#EC2_On-Demand_Instance_limits).

###### Tasks

- [Monitor On-Demand Instance quotas and usage](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html#monitoring-on-demand-limits)

- [Request a quota increase](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html#vcpu-limits-request-increase)


### Monitor On-Demand Instance quotas and usage

You can view and manage your On-Demand Instance quotas for each Region using the following methods.

###### To view your current quotas using the Service Quotas console

1. Open the Service Quotas console at [https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/).

2. From the navigation bar, select a Region.

3. In the filter field, enter `On-Demand`.

4. The **Applied quota value** column displays the maximum
    number of vCPUs for each On-Demand Instance quota type for your account.


###### To view your current quotas using the AWS Trusted Advisor console

Open [Service limits page](https://console.aws.amazon.com/trustedadvisor/home?#/category/service-limits) in the AWS Trusted Advisor console.

###### To configure CloudWatch alarms

With Amazon CloudWatch metrics integration, you can monitor your EC2 usage against your
quotas. You can also configure alarms to warn about approaching quotas. For more information, see [Service\\
Quotas and Amazon CloudWatch alarms](https://docs.aws.amazon.com/servicequotas/latest/userguide/configure-cloudwatch.html) in the _Service Quotas User Guide_.

### Request a quota increase

Even though Amazon EC2 automatically increases your On-Demand Instance quotas based on your usage,
you can request a quota increase if necessary. For example, if you intend to launch
more instances than your current quota allows, you can request a quota increase by
using the
Service Quotas console described in [Amazon EC2 service quotas](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html).

## Query the prices of On-Demand Instances

You can use the Price List Service API or the AWS Price List API to query the
prices of On-Demand Instances. For more information, see [Using the AWS Price List API](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/price-changes.html)
in the _AWS Billing User Guide_.

[Document Conventions](https://docs.aws.amazon.com/general/latest/gr/docconventions.html)

Billing and purchasing options

Reserved Instances

Did this page help you? - Yes

Thanks for letting us know we're doing a good job!

If you've got a moment, please tell us what we did right so we can do more of it.

Did this page help you? - No

Thanks for letting us know this page needs work. We're sorry we let you down.

If you've got a moment, please tell us how we can make the documentation better.

### View related pages

Abstracts generated by AI

- 1
- 2
- 3

AWSEC2 › UserGuide
[Spot Instance quotas![](https://prod.us-west-2.tcx-beacon.docs.aws.dev/recommendation-beacon/similar/impressions/null/nUPm3VG8dVonG8TISL2Wj0KFOXfg7YOrsbtT75McMx3yGU0ZVECQDA==/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cec2-on-demand-instances.html/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cusing-spot-limits.html)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-limits.html)
Learn about Amazon EC2 Spot Instance vCPU quotas by instance family, default limits, and how to request a quota increase using the Service Quotas console.

_August 6, 2023_

AWSEC2 › UserGuide
[Spot Instances![](https://prod.us-west-2.tcx-beacon.docs.aws.dev/recommendation-beacon/similar/impressions/null/nUPm3VG8dVonG8TISL2Wj0KFOXfg7YOrsbtT75McMx3yGU0ZVECQDA==/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cec2-on-demand-instances.html/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cusing-spot-instances.html)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html)
Learn about Amazon EC2 Spot Instances — how they work, key concepts, pricing, savings, and differences compared to On-Demand Instances.

_August 6, 2023_

AWSEC2 › UserGuide
[Amazon EC2 billing and purchasing options![](https://prod.us-west-2.tcx-beacon.docs.aws.dev/recommendation-beacon/similar/impressions/null/nUPm3VG8dVonG8TISL2Wj0KFOXfg7YOrsbtT75McMx3yGU0ZVECQDA==/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cec2-on-demand-instances.html/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cinstance-purchasing-options.html)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html)
Compare Amazon EC2 billing and purchasing options including On-Demand, Reserved, Spot, Dedicated Hosts, and Capacity Reservations to optimize your costs.

_August 6, 2023_

- ### On this page

- ### Related resources





[Amazon EC2 Instance Types Guide](https://docs.aws.amazon.com/ec2/latest/instancetypes/)



[Amazon EBS User Guide](https://docs.aws.amazon.com/ebs/latest/userguide/)



[Amazon EC2 Developer Guide](https://docs.aws.amazon.com/ec2/latest/devguide/)

- Recommended tasks






















### Learn about

















[Amazon EC2 Spot Instances pricing and benefits![](https://prod.us-west-2.tcx-beacon.docs.aws.dev/recommendation-beacon/journey/impressions/null/nUPm3VG8dVonG8TISL2Wj0KFOXfg7YOrsbtT75McMx3yGU0ZVECQDA==/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cec2-on-demand-instances.html/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cusing-spot-instances.html)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html)



[Amazon EC2 service quotas and port 25 restriction![](https://prod.us-west-2.tcx-beacon.docs.aws.dev/recommendation-beacon/journey/impressions/null/nUPm3VG8dVonG8TISL2Wj0KFOXfg7YOrsbtT75McMx3yGU0ZVECQDA==/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cec2-on-demand-instances.html/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cec2-resource-limits.html)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html)



[Amazon EC2 instance types by region![](https://prod.us-west-2.tcx-beacon.docs.aws.dev/recommendation-beacon/journey/impressions/null/nUPm3VG8dVonG8TISL2Wj0KFOXfg7YOrsbtT75McMx3yGU0ZVECQDA==/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cec2-on-demand-instances.html/https:%7C%7Cdocs.aws.amazon.com%7Cec2%7Clatest%7Cinstancetypes%7Cec2-instance-regions.html)](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-regions.html)



[Amazon EC2 billing and purchasing options comparison![](https://prod.us-west-2.tcx-beacon.docs.aws.dev/recommendation-beacon/journey/impressions/null/nUPm3VG8dVonG8TISL2Wj0KFOXfg7YOrsbtT75McMx3yGU0ZVECQDA==/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cec2-on-demand-instances.html/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cinstance-purchasing-options.html)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html)



[EC2 instance type quotas and vCPU limits![](https://prod.us-west-2.tcx-beacon.docs.aws.dev/recommendation-beacon/journey/impressions/null/nUPm3VG8dVonG8TISL2Wj0KFOXfg7YOrsbtT75McMx3yGU0ZVECQDA==/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cec2-on-demand-instances.html/https:%7C%7Cdocs.aws.amazon.com%7Cec2%7Clatest%7Cinstancetypes%7Cec2-instance-quotas.html)](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-quotas.html)

























### How to

















[request a service quota increase using AWS tools![](https://prod.us-west-2.tcx-beacon.docs.aws.dev/recommendation-beacon/journey/impressions/null/nUPm3VG8dVonG8TISL2Wj0KFOXfg7YOrsbtT75McMx3yGU0ZVECQDA==/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cec2-on-demand-instances.html/https:%7C%7Cdocs.aws.amazon.com%7Cservicequotas%7Clatest%7Cuserguide%7Crequest-quota-increase.html)](https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html)

- Recently added to this guide












  - [Troubleshoot your Windows instance using SAC![](https://prod.us-west-2.tcx-beacon.docs.aws.dev/recommendation-beacon/new/impressions/null/nUPm3VG8dVonG8TISL2Wj0KFOXfg7YOrsbtT75McMx3yGU0ZVECQDA==/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Cec2-on-demand-instances.html/https:%7C%7Cdocs.aws.amazon.com%7CAWSEC2%7Clatest%7CUserGuide%7Ctroubleshoot-windows-sac.html)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/troubleshoot-windows-sac.html)



    _September 15, 2026_


- Did this page help you?








Yes



No













[Provide feedback](https://docs.aws.amazon.com/feedback/doc-feedback.html?hidden_service_name=EC2&topic_url=https%3A%2F%2Fdocs.aws.amazon.com%2FAWSEC2%2Flatest%2FUserGuide%2Fec2-on-demand-instances.html)


#### Next topic:

[Reserved Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html)

#### Previous topic:

[Billing and purchasing options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html)
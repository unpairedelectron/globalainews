Source: https://aws.amazon.com/ec2/capacityblocks/pricing/
Title: Amazon EC2 Capacity Blocks for ML Pricing – AWS
Fetched: 2026-10-04T08:16:59.947Z

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

 [Skip to main content](https://aws.amazon.com/ec2/capacityblocks/pricing/#aws-page-content-main)

Amazon EC2 Capacity Blocks

- More


# Amazon EC2 Capacity Blocks for ML pricing

## Announcement: Capacity Block Pricing Update

_**Amazon EC2 Capacity Blocks for ML reservation prices are dynamic and are updated periodically based on supply and demand. Effective October 7, 2026, hourly rates per accelerator across all available AWS Regions will be: P6-B300 at $16.146 ($16.819 in AWS GovCloud Regions), P6-B200 at $14.208 ($14.801 in AWS GovCloud Regions), P5en at $7.895, P5e at $6.866, P5 at $5.970, P4de at $2.546, and P4d at $1.696. All other EC2 Capacity Block prices, as well as prices on fixed pricing models like On-Demand and Savings Plans, remain unchanged.**_

## Why Amazon EC2 Capacity Blocks for ML?

With Amazon EC2 Capacity Blocks for ML, you can reserve just the amount of accelerator capacity you need to run your machine learning workloads. EC2 Capacity Blocks pricing consists of a reservation fee and an operating system fee. Prices and examples of these fees are provided below. Learn more about [EC2 Capacity Blocks](https://aws.amazon.com/ec2/capacityblocks/).

## Pricing tables

The reservation fee is charged up front at the time you schedule the reservation. Reservation prices are updated regularly based on trends in supply and demand for EC2 Capacity Blocks. The current prices are scheduled to be updated next in October, 2026. Your Capacity Block is charged at the prevailing rate at the time of purchase, even if the Capacity Block is scheduled to start after the price is updated. The current reservation rates for accelerated instances are shown in the table below.  Detailed specifications for these instances can be found [here](https://aws.amazon.com/ec2/instance-types/#Accelerated_Computing).

## P6e Pricing

| UltraServer Type | Region | Effective Hourly Rate PER ULTRASERVER (PER ACCELERATOR) | ACCELERATOR |
| --- | --- | --- | --- |
| u-p6e-gb200x72 | US East (Dallas) Local Zone | $761.904 ($10.582 USD) | 72 x B200 |
| u-p6e-gb200x36 | US East (Dallas) Local Zone | $380.952 ($10.582 USD) | 36 x B200 |

If we detect impairment impacting an ultraserver capacity block, we

will notify you but generally will not take action to terminate your

instances on the capacity block. This is to minimize unintended

disruption to your workloads. You can continue using the ultraserver

capacity block as is after receiving this notification or request

remediation by terminating all instances on the capacity block and

submitting an AWS support case. After we receive your support case, we

will notify you when we have completed remediation and you can relaunch

instances onto your ultraserver capacity block.

Show more

## P6-B300 Pricing

| Instance Type | Region | Effective Hourly Rate PER INSTANCE (PER ACCELERATOR) | ACCELERATOR |
| --- | --- | --- | --- |
| p6-b300.48xlarge | US West (Oregon) | $112.32 USD ($14.04 USD) | 8 x B300 |
| p6-b300.48xlarge | US East (N. Virginia) | $112.32 USD ($14.04 USD) | 8 x B300 |
| p6-b300.48xlarge | AWS GovCloud (US-East) | $117.00 USD ($14.625 USD) | 8 x B300 |
| p6-b300.48xlarge | US East (Atlanta) Local Zone | $112.32 USD ($14.04 USD) | 8 x B300 |
| p6-b300.48xlarge | Asia Pacific (Seoul) | $112.32 USD ($14.04 USD) | 8 x B300 |
| p6-b300.48xlarge | Asia Pacific (Hyderabad) | $112.32 USD ($14.04 USD) | 8 x B300 |
| p6-b300.48xlarge | Asia Pacific (Jakarta) | $112.32 USD ($14.04 USD) | 8 x B300 |

## P6-B200 Pricing

| Instance Type | Region | Effective Hourly Rate PER INSTANCE (PER ACCELERATOR) | ACCELERATOR |
| --- | --- | --- | --- |
| p6-b200.48xlarge | US East (Ohio) | $98.84 USD ($12.355 USD) | 8 x B200 |
| p6-b200.48xlarge | US East (N. Virginia) | $98.84 USD ($12.355 USD) | 8 x B200 |
| p6-b200.48xlarge | US West (Oregon) | $98.84 USD ($12.355 USD) | 8 x B200 |
| p6-b200.48xlarge | AWS GovCloud (US-West) | $102.960 USD ($12.870 USD) | 8 x B200 |
| p6-b200.48xlarge | AWS GovCloud (US-East) | $102.960 USD ($12.870 USD) | 8 x B200 |
| p6-b200.48xlarge | Asia Pacific (Mumbai) | $98.84 USD ($12.355 USD) | 8 x B200 |
| p6-b200.48xlarge | Asia Pacific (Hyderabad) | $98.84 USD ($12.355 USD) | 8 x B200 |
| p6-b200.48xlarge | Europe (Stockholm) | $98.84 USD ($12.355 USD) | 8 x B200 |
| p6-b200.48xlarge | Europe (Paris) | $98.84 USD ($12.355 USD) | 8 x B200 |

## P5 Pricing

| Instance Type | Region | Effective Hourly Rate PER INSTANCE (PER ACCELERATOR) | ACCELERATOR |
| --- | --- | --- | --- |
| p5.48xlarge | US East (Atlanta) Local Zone | $41.528 USD ($5.191 USD) | 8 x H100 |
| p5.48xlarge | US East (N. Virginia) | $41.528 USD ($5.191 USD) | 8 x H100 |
| p5.48xlarge | US East (Ohio) | $41.528 USD ($5.191 USD) | 8 x H100 |
| p5.48xlarge | US West (Oregon) | $41.528 USD ($5.191 USD) | 8 x H100 |
| p5.48xlarge | US West (N. California) | $41.528 USD ($5.191 USD) | 8 x H100 |
| p5.48xlarge | Asia Pacific (Tokyo) | $37.76 USD ($4.720 USD) | 8 x H100 |
| p5.48xlarge | Asia Pacific (Jakarta) | $37.76 USD ($4.720 USD) | 8 x H100 |
| p5.48xlarge | Asia Pacific (Mumbai) | $37.76 USD ($4.720 USD) | 8 x H100 |
| p5.48xlarge | Australia (Sydney) | $37.76 USD ($4.720 USD) | 8 x H100 |
| p5.48xlarge | Europe (London) | $37.76 USD ($4.720 USD) | 8 x H100 |
| p5.48xlarge | Europe (Stockholm) | $37.76 USD ($4.720 USD) | 8 x H100 |
| p5.48xlarge | South America (Sao Paulo) | $37.76 USD ($4.720 USD) | 8 x H100 |
| p5.4xlarge | US East (N. Virginia) | $5.191 USD ($5.191 USD) | 1 x H100 |
| p5.4xlarge | US East (Ohio) | $5.191 USD ($5.191 USD) | 1 x H100 |
| p5.4xlarge | US West (Oregon) | $5.191 USD ($5.191 USD) | 1 x H100 |
| p5.4xlarge | Asia Pacific (Tokyo) | $4.720 USD ($4.720 USD) | 1 x H100 |
| p5.4xlarge | Asia Pacific (Mumbai) | $4.720 USD ($4.720 USD) | 1 x H100 |
| p5.4xlarge | Australia (Sydney) | $4.720 USD ($4.720 USD) | 1 x H100 |
| p5.4xlarge | Europe (London) | $4.720 USD ($4.720 USD) | 1 x H100 |
| p5.4xlarge | South America (Sao Paulo) | $4.720 USD ($4.720 USD) | 1 x H100 |

## P5e Pricing

| Instance Type | Region | Effective Hourly Rate PER INSTANCE (PER ACCELERATOR) | ACCELERATOR |
| --- | --- | --- | --- |
| p5e.48xlarge | US East (Ohio) | $47.76 USD ($5.97 USD) | 8 x H200 |
| p5e.48xlarge | US West (N. California) | $47.76 USD ($5.97 USD) | 8 x H200 |
| p5e.48xlarge | US West (Oregon) | $47.76 USD ($5.97 USD) | 8 x H200 |
| p5e.48xlarge | US West (Phoenix) Local Zone | $47.76 USD ($5.97 USD) | 8 x H200 |
| p5e.48xlarge | Europe (Stockholm) | $47.76 USD ($5.97 USD) | 8 x H200 |
| p5e.48xlarge | Europe (London) | $47.76 USD ($5.97 USD) | 8 x H200 |
| p5e.48xlarge | Australia (Sydney) | $47.76 USD ($5.97 USD) | 8 x H200 |
| p5e.48xlarge | Asia Pacific (Jakarta) | $47.76 USD ($5.97 USD) | 8 x H200 |
| p5e.48xlarge | Asia Pacific (Mumbai) | $47.76 USD ($5.97 USD) | 8 x H200 |
| p5e.48xlarge | Asia Pacific (Tokyo) | $47.76 USD ($5.97 USD) | 8 x H200 |
| p5e.48xlarge | South America (Sao Paulo) | $47.76 USD ($5.97 USD) | 8 x H200 |

## P5en Pricing

| Instance Type | Region | Effective Hourly Rate PER INSTANCE (PER ACCELERATOR) | ACCELERATOR |
| --- | --- | --- | --- |
| p5en.48xlarge | US East (Ohio) | $54.920 USD ($6.865 USD) | 8 x H200 |
| p5en.48xlarge | US East (N. Virginia) | $54.920 USD ($6.865 USD) | 8 x H200 |
| p5en.48xlarge | US West (N. California) | $54.920 USD ($6.865 USD) | 8 x H200 |
| p5en.48xlarge | US West (Oregon) | $54.920 USD ($6.865 USD) | 8 x H200 |
| p5en.48xlarge | Europe (Stockholm) | $49.928 USD ($6.241 USD) | 8 x H200 |
| p5en.48xlarge | Europe (London) | $49.928 USD ($6.241 USD) | 8 x H200 |
| p5en.48xlarge | Europe (Spain) | $49.928 USD ($6.241 USD) | 8 x H200 |
| p5en.48xlarge | Asia Pacific (Jakarta) | $49.928 USD ($6.241 USD) | 8 x H200 |
| p5en.48xlarge | Asia Pacific (Mumbai) | $49.928 USD ($6.241 USD) | 8 x H200 |
| p5en.48xlarge | Asia Pacific (Tokyo) | $49.928 USD ($6.241 USD) | 8 x H200 |
| p5en.48xlarge | Asia Pacific (Seoul) | $49.928 USD ($6.241 USD) | 8 x H200 |
| p5en.48xlarge | US East (Atlanta) Local Zone | $54.920 USD ($6.865 USD) | 8 x H200 |

## P4 Pricing

| Instance Type | Region | Effective Hourly Rate PER INSTANCE (PER ACCELERATOR) | ACCELERATOR |
| --- | --- | --- | --- |
| p4d.24xlarge | US East (N. Virginia) | $11.8 USD ($1.475 USD) | 8 x A100 |
| p4d.24xlarge | US East (Ohio) | $11.8 USD ($1.475 USD) | 8 x A100 |
| p4d.24xlarge | US West (Oregon) | $11.8 USD ($1.475 USD) | 8 x A100 |
| p4de.24xlarge | US West (Oregon) | $17.712 USD ($2.214 USD) | 8 x A100 |
| p4de.24xlarge | US East (N. Virginia) | $17.712 USD ($2.214 USD) | 8 x A100 |

## Trn1 and Trn2 Pricing

| Instance Type | Region | Effective Hourly Rate PER INSTANCE (PER ACCELERATOR) | ACCELERATOR |
| --- | --- | --- | --- |
| trn1.32xlarge | US East (N. Virginia) | $9.532 USD ($0.596 USD) | 16 x AWS Trainium |
| trn1.32xlarge | US East (Ohio) | $9.532 USD ($0.596 USD) | 16 x AWS Trainium |
| trn1.32xlarge | US West (Oregon) | $9.532 USD ($0.596 USD) | 16 x AWS Trainium |
| trn1.32xlarge | Asia Pacific (Mumbai) | $9.532 USD ($0.596 USD) | 16 x AWS Trainium |
| trn1.32xlarge | Australia (Melbourne) | $9.532 USD ($0.596 USD) | 16 x AWS Trainium |
| trn1.32xlarge | Australia (Sydney) | $9.532 USD ($0.596 USD) | 16 x AWS Trainium |
| trn1.32xlarge | Europe (Stockholm) | $9.532 USD ($0.596 USD) | 16 x AWS Trainium |
| trn2.48xlarge | US East (Ohio) | $35.7608 USD ($2.235 USD) | 16 x AWS Trainium2 |
| trn2.48xlarge | Asia Pacific (Hyderabad) | $35.7608 USD ($2.235 USD) | 16 x AWS Trainium2 |
| trn2.3xlarge | Asia Pacific (Hyderabad) | $2.235 USD ($2.235 USD) | 1 x AWS Trainium2 |
| trn2.3xlarge | Australia (Melbourne) | $2.235 USD ($2.235 USD) | 1 x AWS Trainium2 |
| trn2.3xlarge | South America (Sao Paulo) | $2.235 USD ($2.235 USD) | 1 x AWS Trainium2 |

## OS Pricing

When you use an EC2 Capacity Block, you pay for the operating system you use when your instances are running. Linux, Ubuntu Pro, Red Hat Enterprise Linux (RHEL), and RHEL with HA operating system prices are billed at per-second granularity. SUSE Linux Enterprise Server (SLES) is billed at a flat, hourly rate (minimum one-hour billing). The pricing below shows the hourly rate you pay by the operating system you use for your instance.

**Notice: Red Hat has made an update to their cloud pricing model for Red Hat Enterprise Linux (RHEL). On July 1, 2024 pricing for EC2 RHEL changed to a per-vCPU-hour based pricing model. Learn about the new prices in the [RHEL on AWS Pricing](https://aws.amazon.com/partners/redhat/rhel-pricing/) page.**

## OS pricing across Instance Types

| Instance Size | Linux | Red Hat Enterprise Linux (RHEL) | RHEL with HA | SLES | Ubuntu Pro |
| --- | --- | --- | --- | --- | --- |
| p6-b300.48xlarge | $0.000 USD | $1.8432 USD | $3.8592 USD | $0.125 USD | $0.336 USD |
| p6-b200.48xlarge | $0.000 USD | $1.8432 USD | $3.8592 USD | $0.125 USD | $0.336 USD |
| p5.48xlarge | $0.000 USD | $1.8432 USD | $3.8592 USD | $0.125 USD | $0.336 USD |
| p5e.48xlarge | $0.000 USD | $1.8432 USD | $3.8592 USD | $0.125 USD | $0.336 USD |
| p5en.48xlarge | $0.000 USD | $1.8432 USD | $3.8592 USD | $0.125 USD | $0.336 USD |
| p4d.24xlarge | $0.000 USD | $1.0368 USD | $2.3808 USD | $0.125 USD | $0.168 USD |
| trn1.32xlarge | $0.000 USD | $1.2288 USD | $2.5728 USD | $0.125 USD | $0.224 USD |
| trn2.48xlarge | $0.000 USD | $1.8432 USD | N/A | $0.125 USD | $0.336 USD |

## Pricing Example 1

On March 20, 2025 you purchase an EC2 Capacity Block for four p5.48xlarge instances in the US East (Ohio) region with a start date of March 29, 2025 and an end date of March 31, 2025 (reservation duration of 48 hours). At the time of purchase, the effective instance hourly rate for p5.48xlarge instances in the US East (Ohio) region is $31.464 USD. When your EC2 Capacity Block reservation begins, you launch all four instances into the reservation using the Red Hat Enterprise Linux operating system at the reservation start time. You run your instances continuously and terminate them one hour before your reservation expiration time. The total price you pay is calculated as follows:

**RESERVATION UPFRONT CHARGE**

- Instance-hours reserved: 192 instance-hours
- Reservation price at time of purchase: $31.464 USD / instance-hour
- Charge for reservation: $6,041.088 USD

**OPERATING SYSTEM CHARGE**

- Instance-hours used: 188 instance-hours
- Operating system price: $1.8432 USD / instance-hour
- Charge for operating system usage: $346.52 USD

**Total charges: $6,387.608 USD**

## Additional pricing resources

[Automations **AWS Pricing Calculator**\\
\\
Easily calculate your monthly costs with AWS\\
\\
Learn more](https://calculator.aws/#/addService)

[Automations **Get pricing assistance**\\
\\
Contact AWS specialists to get a personalized quote\\
\\
Learn more](https://aws.amazon.com/contact-us/sales-support-pricing/)

## Get started

[Getting started\\
\\
**Learn how to get started**\\
\\
Learn more\\
\\
![](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/product-categories/networking/approved/images/9683c48e-c117-42b3-949d-62da59bd9c5d.1b30c96bf96135ce5bc1ddbcdd343bb9af413c02.jpeg)](https://aws.amazon.com/ec2/getting-started/)

[Getting started\\
\\
**Sign up for an AWS account**\\
\\
Sign up\\
\\
![](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/product-categories/networking/approved/images/639ddfa6-eb09-4561-a2e1-4d2d80814a15.0adf5883d1ec40f6d5bd8a86cd96585f2acd4172.jpeg)](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html)

[Console\\
\\
**Start building in the console**\\
\\
Sign in\\
\\
![](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/product-categories/networking/approved/images/2c50fb03-8156-4fb1-9937-1dfed809a9e2.06eac12d5b4bcc82b408e82b2bd6ada2b0af9aa2.jpeg)](https://console.aws.amazon.com/)

Hi, I can connect you with an AWS representative or answer questions you have on AWS.

Need more info? Highlight any text to get an explanation generated with AWS generative AI.

2
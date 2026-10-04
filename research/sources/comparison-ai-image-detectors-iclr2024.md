Source: https://proceedings.iclr.cc/paper_files/paper/2024/file/744e09d3213ee53de88f04164a9b06ab-Paper-Conference.pdf
Title: 
Fetched: 2026-10-04T09:57:57.046Z

Published as a conference paper at ICLR 2024

# ROBUSTNESS OF AI-IMAGE DETECTORS: FUNDAMENTAL LIMITS AND PRACTICAL ATTACKS

Mehrdad Saberi1, Vinu Sankar Sadasivan1, Keivan Rezaei1, Aounon Kumar1, Atoosa Chegini1, Wenxiao Wang1, Soheil Feizi1 1 Department of Computer Science, University of Maryland

{msaberi,vinu,krezaei,aounon,atoocheg,wwx,sfeizi}@umd.edu

## ABSTRACT

In light of recent advancements in generative AI models, it has become essential to distinguish genuine content from AI-generated one to prevent the malicious usage of fake materials as authentic ones and vice versa. Various techniques have been introduced for identifying AI-generated images, with watermarking emerging as a promising approach. In this paper, we analyze the robustness of various AI-image detectors including watermarking and classifier-based deepfake detectors. For watermarking methods that introduce subtle image perturbations (i.e., low perturbation budget methods), we reveal a fundamental trade-off be- tween the evasion error rate (i.e., the fraction of watermarked images detected as non-watermarked ones) and the spoofing error rate (i.e., the fraction of non- watermarked images detected as watermarked ones) upon an application of dif- fusion purification attack. To validate our theoretical findings, we also provide empirical evidence demonstrating that diffusion purification effectively removes low perturbation budget watermarks by applying minimal changes to images. For high perturbation watermarking methods where notable changes are applied to images, the diffusion purification attack is not effective. In this case, we develop a model substitution adversarial attack that can successfully remove watermarks. Moreover, we show that watermarking methods are vulnerable to spoofing attacks where the attacker aims to have real images (potentially obscene) identified as watermarked ones, damaging the reputation of the developers. In particular, by just having black-box access to the watermarking method, we show that one can generate a watermarked noise image, which can be added to the real images, lead- ing to their incorrect classification as watermarked. Finally, we extend our theory to characterize a fundamental trade-off between the robustness and reliability of classifier-based deep fake detectors and demonstrate it through experiments. Code is available at [https://github.com/mehrdadsaberi/watermark](https://github.com/mehrdadsaberi/watermark) robustness.

## 1 INTRODUCTION

As generative AI systems advance in sophistication and accessibility, the production of persuasive fabricated digital content becomes more accessible. These systems have the ability to craft hyper- realistic media forms such as images, videos, and audio (referred to as deepfakes), capable of deceiv- ing viewers and listeners (Helmus, 2022). This misapplication of AI introduces potential hazards related to misinformation, fraud, and even national security issues like election manipulation (Blauth et al., 2022; Chesney & Citron, 2019). Moreover, deepfakes can result in personal harm, spanning from character defamation to emotional distress, impacting both individuals and broader society (Ice, 2019). Consequently, the identification of AI-generated content and, importantly, tracing its sources, emerges as a crucial challenge to address.

Over the years, numerous techniques for recognizing AI-generated images have emerged. Among these, Image watermarking stands out as a promising approach (Honsinger, 2002; Swanson et al.,

1998). Watermarking techniques, along with their many other applications (Potdar et al., 2005; Zhao et al., 2023c; Cui et al., 2023), can be integrated with image generation models (Rombach et al.,
2022) to inject watermarks to AI-generated images, which enables them to be differentiated from

---

Low Perturbation Budget

High Perturbation Budget

(I) Training Classifier

(II) Applying PGD

(III) Attack on Black-Box Detector

Figure 1: Illustration of our attacks against image watermarking methods. Upper panel demonstrates the diffusion purification attack for low perturbation budget (imperceptible) watermarks. It
adds Gaussian noise to images, creating an indistinguishable region, which results in a certified
lower bound on the error of watermark detectors. Noisy images are then denoised using diffusion
models. See Section 3.1 for the definition of the used terms (e.g., R, F). Lower panel depicts
our model substitute adversarial attack against high-perturbation budget watermarks. Our attack involves training a substitute classifier, conducting a PGD attack on the substitute model, and using
these manipulated images to deceive the black-box watermark detector.

real images later. These techniques also allow for tracing the source of generation for images. Given
the continuous enhancement in deepfake image quality and the growing challenge of distinguishing
them from real ones, the adoption of image watermarking over classifier-based detection techniques
is becoming a more sensible choice.

In this paper, we demonstrate a fundamental constraint on the robustness of image watermarking
methods. We leverage a technique called diffusion purification (Nie et al., 2022), originally proposed
as a defense against adversarial examples. This approach involves the introduction of Gaussian noise
to images and utilizing the denoising process of diffusion models (Ho et al., 2020) to eliminate the
added noise. We offer both theoretical and empirical evidence that this attack amplifies the error
rates of watermarking methods that have a low Wasserstein distance between the distributions of
their watermarked and non-watermarked images, which we refer to as “low perturbation budget”
watermarking methods; i.e., watermarks with subtle image perturbations.
To elaborate, if R and F represent the distributions of non-watermarked and watermarked images,

To elaborate, if R and F represent the distributions of non-watermarked and watermarked images,
t t
and R and F denote the distributions of these images after the application of the diffusion purification attack, we demonstrate that:
√

e_{0}

\ (.)

W(.,,)

t,

If the Wasserstein distance between the distributions of watermarked and non-watermarked images
is large (i.e., high perturbation budget watermarking), our theoretical bound based on diffusion purification attack becomes vacuous. In fact, we also empirically observe that this attack does not

e_{0}(\mathcal{F}^{t},D)+e_{1}(\mathcal{R}^{t},D)\geq1-\mathsf{e r f}(\frac{\sqrt{\bar{\alpha_{t}}}\operatorname{\mathsf{W}}(\mathcal{R},\mathcal{F})}{2\sqrt{2(1-\bar{\alpha_{t}})}}),

\mathcal{R}^{t}

\mathcal{F}

\mathcal{F}_{\mathrm{~\scriptsize~,~}} compromise existing high perturbation budget watermarking methods where notable changes are
applied to the images such as TreeRing (Wen et al., 2023) (Figure 4). In this regime, we develop
a method that trains a substitute classifier capable of distinguishing between watermarked and nonwatermarked images. Subsequently, we execute an adversarial attack (Madry et al., 2017) on images
using this substitute classifier. Intriguingly, these attacks appear to transfer successfully to the authentic watermark detector. Our adversarial attack manages to decrease the AUROC of the TreeRing
method to 0.14 by employing an ℓ∞attack with ϵ = 2/255. A distinguishing feature of our attack,
in contrast to previously proposed white-box and black-box attacks (Jiang et al., 2023), is that it does
not necessitate real-time access to the watermark detector. Instead, it operates by collecting images
watermarked by a specific watermark model from the internet.

\ell_{\infty}

We note that some watermarking methods such as StegaStamp (Tancik et al., 2020) impose large
perturbations in the latent (feature) space but relatively smaller perturbations in the image space
(Table 1). We show that both the diffusion purification attack (in the image space) as well as our
model substitution adversarial attack are successful in breaking the StegaStamp watermark, especially using larger diffusion steps or adversarial perturbation budgets.

In addition to the previously mentioned attacks, we introduce a spoofing attack designed to target the
spoofing error in watermarking methods. These attacks have the potential to erroneously categorize
explicit or inappropriate content as watermarked, which could have adverse implications for the
developers associated with a watermarked generative model, including loss of trust, financial loss,
and negative publicity. Our attack functions by instructing watermarking models to watermark a
white noise image and then blending this noisy watermarked image with non-watermarked ones to
deceive the detector into flagging them as watermarked.

Finally, we extend our theory originally established for watermarking methods, to offer a corresponding theoretical insight for classifier-based AI-image detectors. Our analysis demonstrates a
fundamental trade-off between the robustness and reliability of these detectors. As the distributions
of real and fake images grow more alike, this trade-off becomes more pronounced. This implies that
a detector could only achieve good performance or high robustness, but not both, simultaneously.
We further present empirical evidence for this trade-off on some real-world detectors.

Summary of Contributions. In this paper, we make the following contributions:

1.We characterize a fundamental trade-off between evasion and spoofing error rates of image
watermarking upon the application of a diffusion purification attack. Empirically, we show
that diffusion purification attack can break a whole range of watermarking methods that
introduce subtle image perturbations (i.e., low perturbation budget image watermarking).

2.For high perturbation image watermarking that leaves notable changes on the original images, we show that the diffusion purification attack is not effective. Instead, we develop a
model substitution adversarial attack that can successfully remove the watermarks.

Image Watermarking. Image watermarking is a versatile technology with applications in copyright
protection, content authenticity, data authentication, privacy preservation, and branding. Its evolution began with manual methods like LSB (Wolfgang & Delp, 1996), and later techniques involved
altering spatial or frequency domains (Ghazanfari et al., 2011; Holub & Fridrich, 2012; Pevny et al., `
2010; Boland et al., 1995; Cox et al., 1996; O’Ruanaidh & Pun, 1997). Various transformations
such as DCT, DWT, SVD-decomposition (Chang et al., 2005), and Radon transformations (Seo
et al., 2004) were explored. Recent advancements incorporate deep learning and generative models
like SteganoGAN (Zhang et al., 2019a), StegaStamp (Tancik et al., 2020) RivaGAN (Zhang et al.,
2019c), WatermarkDM (Zhao et al., 2023b), MBRS (Jia et al., 2021), and Tree Ring (Wen et al.,
2023), each employing different methods to embed watermarks into images.

2 PRIOR WORK

3.We introduce a spoofing attack against watermarking by adding a watermarked noise image
to clean images, in order to deceive the detector into flagging them as watermarked.
4.We develop a fundamental trade-off between the robustness and reliability of deepfake

4.We develop a fundamental trade-off between the robustness and reliability of deepfake
detectors and substantiate this concept through experiments.

---

Figure 2: Lower bound on the sum of evasion and spoofing errors of image watermarks
against diffusion purification attack from Theorem 1. The beta schedule for the diffusion
model is linear in the range [0.0008, 0.0120].

Figure 3: ROC curves for empirical robustness
of image watermark methods against diffusion
purification attack with t = 0.2. The dashed
lines show the ROC curves of methods without
attacking them.

There have been several works trying to attack watermarking methods (Jiang et al., 2023; Wang
et al., 2022a). Notably a recent concurrent work (Zhao et al., 2023a) also proves that the diffusion
purification attack is successful against invisible (low perturbation budget) watermarking. However,
(Zhao et al., 2023a) is unable to attack high perturbation budget watermarking methods such as Tree
Ring or StegaStamp and argues that they are more reliable watermarking alternatives. In contrast,
we show that our model substitution adversarial attack can effectively break those watermarking
methods. Additionally, we show that several watermarking approaches are vulnerable to spoofing
attacks and characterize a robustness-reliability trade-off for a classification-based deepfake detector.
Classifier-based Detectors. Several machine-learning approaches focusing on detecting artifacts

t\,=\,0.2

Classifier-based Detectors. Several machine-learning approaches focusing on detecting artifacts
in AI-generated content have been studied. For instance, Matern et al. (2019) target irregularities
in face editing algorithms, while Ciftci & Demir (2019) exploit biological signals. Li et al. (2020)
introduce a technique for identifying partially manipulated videos, and Guarnera et al. (2020) harness the traces from convolutional layers of generative adversarial networks in fake image detection.
Bonomi et al. (2021) analyze spatiotemporal texture dynamics of video signals for Deepfake detection. A plethora of works focus on facial forgery or Deepfake detection using convolution net-based
classifiers (Cozzolino et al., 2017; Bayar & Stamm, 2016; Rahmouni et al., 2017; Raja et al., 2017;
Zhou et al., 2017; Dogoulis et al., 2023). Rossler et al. (2019) proposed a face forensics dataset and ¨
train ResNet (He et al., 2015) and XceptionNet (Chollet, 2016) based classifiers using it. However,
as noted in Haliassos et al. (2021), machine learning-based detectors are often vulnerable to novel input perturbations. Such limitations challenge the practical utility of these methods, as any real-world
detector should achieve good performance while being robust to small perturbations in the input.

Consider F to represent the distribution of images that have been watermarked using a particular
key string k, while R represents the distribution of non-watermarked images.
Definition 1 (Evasion and Spoofing Errors). Consider a watermark detector D that predicts values

3 ROBUSTNESS OF IMAGE WATERMARKING FOR AI-IMAGE DETECTION

Definition 1 (Evasion and Spoofing Errors). Consider a watermark detector D that predicts values
of 0 and 1, for non-watermarked and watermarked images, respectively. We define evasion error
(e0) and spoofing error (e1) of D on distributions R and F as follows:

e_{0}(\mathcal{F},D)=\mathbb{P}_{x\sim\mathcal{F}}[D(x)=0]\quad\mathrm{}{a n d}\quad e_{1}(\mathcal{R},D)=\mathbb{P}_{x\sim\mathcal{R}}[D(x)=1]

(e_{1})

\mathcal{F}

(1)

(e_{0})

We measure distance between the distributions R and F using the Wasserstein metric defined as:
W(R, F) = inf E ∥x1 − x2∥ , (2)

\mathcal{F}

\mathsf{W}(\mathcal{R},\mathcal{F})=\operatorname*{i n f}_{\gamma\in\Gamma(\mathcal{R},\mathcal{F})}\mathbb{E}_{(x_{1},x_{2})\sim\gamma}\big[\|x_{1}-x_{2}\|\big], where Γ(R, F) is the set of all joint probability distributions of R and F.
Definition 2. (Diffusion Purification) Diffusion purification using a denoising diffusion probabilistic

\Gamma(\mathcal{R},\mathcal{F})

\mathcal{F}

Definition 2. (Diffusion Purification) Diffusion purification using a denoising diffusion probabilistic
model consists of two steps. In the first step, an image x0 is received and xtis calculated as:
√

x_{t}

x_{0}

x_{t}\sim\mathcal{N}\big(\sqrt{\bar{\alpha}_{t}}x_{0},(1-\bar{\alpha}_{t})I\big),

where α¯tis an increasing function of t that spans from 1 to 0 as t progresses from 0 to 1. Afterward,
out
xtis denoised using a denoising model to output an image x0. The denoising model is trained to
out out
minimize ∥x0− x0∥. We represent diffusion purification as DPt(.) where x0∼ DPt(x0).

\bar{\alpha}_{t}

x_{t}

x_{0}^{o u t}

\|x_{0}^{o u t}-\tilde{x_{0}}\|

\ x_{0}^{o u t}\sim D P_{t}(x_{0})

This technique was previously used in some other applications. For instance, in a prior study (Nie
et al., 2022), it was employed to eliminate adversarial perturbations from images as a defense strategy against adversarial attacks. In the following theorem, we claim that applying diffusion purification on images establishes a lower bound on the sum of evasion and spoofing errors of watermark
detectors. Luo (2022) presents comprehensive details on denoising diffusion models and their associated parameters, including α¯t.

\bar{\alpha}_{t}

t out t
Let R be the distribution of x0∼ DPt(x0) where x0 ∼ R. Similarly, define F. Below, we
provide a lower bound on the detector’s error after performing diffusion purification on R and F.
t
Theorem 1. The sum of evasion and spoofing errors of a watermark detector D on distributions R

\mathcal{R}^{t}

\mathcal{F}^{t}

x_{0}^{o u t}\,\sim\,D P_{t}(x_{0})

x_{0}\sim\mathcal{R}

\mathcal{F}

t
Theorem 1. The sum of evasion and spoofing errors of a watermark detector D on distributions R
t
and F is lower bounded as follows:
√

\mathcal{F}^{t}

e_{0}(\mathcal{F}^{t},D)+e_{1}(\mathcal{R}^{t},D)\geq1-\mathsf{e r f}(\frac{\sqrt{\bar{\alpha_{t}}}\operatorname\mathsf{W}(\mathcal{R},\mathcal{F})}{2\sqrt{2(1-\bar{\alpha_{t}})}}),

where erf(.) is the Gauss error function, and the Wasserstein distance is measured w.r.t the ℓ2 norm.

\ell_{2}

In Appendix A.2, we elaborate on how this theorem can be extended to apply diffusion purification
in the latent space rather than the pixel space. Theorem 1 implies that when the Wasserstein distance
between the watermarked and non-watermarked distributions is low (either in pixel or latent spaces),
i.e., watermarking with a low perturbation budget, diffusion purification is effective in compromising
the watermark. The lower bound presented in Theorem 1, employing real-world configurations of a
practical diffusion model, is illustrated in Figure 2, demonstrating the applicability of the theoretical
findings in practical scenarios (i.e., the value of error lower bound is considerable, for real-world
values of Wasserstein distance).

We note that, even though Theorem 1 is stated w.r.t. using diffusion models as the method to
denoise images after adding Gaussian noise to them, our theoretical bound can be attained with any
arbitrary denoising technique (Elad et al., 2023; Wang et al., 2022b) (refer to Appendix B for more
information). A stronger denoising technique permits the use of a higher magnitude of Gaussian
noise, resulting in a more significant lower bound on the error according to Theorem 1.

In the next section, we provide empirical evidence supporting our theoretical result.

We use 64-bit binary keys for watermarking techniques. Our evaluation is conducted on a set of
100 images drawn from the ImageNet dataset (Russakovsky et al., 2015), and their watermarked
counterparts using each method. For the WatermarkDM method, which necessitates pre-training of
its models, we undertake training of the injector and detector models for 20 epochs on the ImageNet
dataset. Watermark detectors, when given an input image and an encryption key, produce a confidence score that corresponds to the likelihood of the image being watermarked with that specific

3.2 LOW PERTURBATION BUDGET WATERMARKS: EMPIRICAL ATTACKS

\ell_{2}

\ell_{2}

---

Figure 4: AUROC of watermarking methods
against diffusion purification attack for a range
of t values. As expected, the robustness of
methods against this attack has a correlation
with the average image ℓ2 distance from Table 1.
2ULJLQDO DwtDct DwtDctSVD 5LYD*$1

\ell_{2}

Figure 5: AUROC of high-perturbation watermarking methods against ℓ∞adversarial attack
w.r.t adversarial perturbation size ϵ. The colored dashed lines measure robustness against
uniform random noise in the range [−2ϵ, 2ϵ].
5LYD*$1 W DWHUPDUN'0 6WHJD6WDPS T UHH5LQJ

\ell_{\infty}

DwtDct DwtDctSVD 5LYD*$1 W DWHUPDUN'0 6WHJD6WDPS

Figure 6: Illustrations of images subjected to the image diffusion purification attack and our adversarial model substitution attack. The s value represents the confidence score assigned by the
watermark detector to the images where a higher score indicates a greater likelihood of the image
being watermarked. These attacks are able to significantly reduce the AUROC of the detectors (details can be found in Figures 3 and Figure 5.)

key. Subsequently, these images are categorized as watermarked if the confidence score exceeds a
predefined threshold, which may either be a constant value or a threshold that varies. In our experiments, we specifically adopt a variable threshold for the process of watermark detection, and use
AUROC (Area Under the Receiver Operating Characteristic) measure as our evaluation metric.

We make use of the image diffusion models presented in Nie et al. (2022), particularly a 256 × 256
unconditional guided diffusion model designed for ImageNet images. As illustrated in Figure 3,
it becomes evident that all the examined watermarking methods can be compromised through a
diffusion purification attack with t = 0.2. Additionally, we carry out a latent diffusion purification
attack, the results of which are detailed in Appendix A.2. Choosing a higher value of t results in
a better attack success rate, however, it might degrade the quality of the generated images. Some
examples of attacked images using different values of t are shown in Figure 6, and the quality
of output images is measured in Table 2 using image quality metric. The diffusion purification

x_{0}

\dot{x_{t}}\sim\mathcal{N}\big(\sqrt{\bar{\alpha}_{t}}x_{0},\dot{\big(11\!-\!\bar{\alpha}_{t}\big)}I\big)

t\in\tilde{|0,1}

---

Figure 7: Left: The figure demonstrates the spoofing of watermarking techniques, comprising clean
ImageNet dataset images (top row), noisy watermarked images (middle row), and spoofed watermarked images (bottom row). Spoofed images blend clean and noisy ones, enabling detection as
watermarked. Right: Spoofing attack on various watermarking methods.

method lowers AUROC by reducing the detector’s confidence in watermarked images and does not
consistently boost the confidence of non-watermarked ones. This is understandable as the space of
watermarked images is typically much smaller than non-watermarked images due to the key string
size. Since diffusion purification is a no-box attack, it cannot apply specific watermark patterns to
non-watermarked images without prior knowledge of methods or key strings.

3.3 HIGH PERTURBATION BUDGET WATERMARKS: EMPIRICAL ATTACKS

For the watermarking methods that impose high perturbations to the inputs (i.e., TreeRing (Wen
et al., 2023) and StegaStamp (Tancik et al., 2020)), our bound in Theorem 1 becomes vacuous
since the Wasserstein distance between watermarked and non-watermarked distributions becomes
large. In fact, Figure 4 shows empirical evidence that as the perturbation budget of watermarking
methods increases, the diffusion purification attack becomes less effective, e.g., TreeRing shows
strong robustness against that.
The StegaStamp watermarking (Tancik et al., 2020) imposes large perturbations in the feature space.

The StegaStamp watermarking (Tancik et al., 2020) imposes large perturbations in the feature space.
While its ℓ2 perturbation in the image space is larger than that of other invisible watermarking methods (Table 1), it is much smaller than that of the TreeRing. That is partially the reason that the
diffusion purification attack in the image space is relatively successful against StegaStamp, especially at higher values of t such as 0.3 which might leave some artifacts on images. Nevertheless,
we categorize StegaStamp as a high perturbation budget watermarking and study additional alternative attacks against it in this section.
For the high perturbation budget watermarking schemes, we develop a model substitution adversarial

Figure 5 displays the AUROC of the methods following adversarial attacks using various adversarial perturbation budgets denoted as ϵ. StegaStamp demonstrates greater resilience to our attack,
requiring an ϵ value of 12/255 before its performance degrades to the level of a random detector.
We note that this level of adversarial noise may leave perceptible artifacts on the images. However,
TreeRing is found to be more vulnerable, as a perturbation budget as low as ϵ = 2/255 can render
it completely ineffective. Note that the transferability of the adversarial attacks is reliant on the
substitute classifier’s architecture and training procedure. In our case, we employ a basic ResNet-18
model with standard training procedures. Opting for a more suitable model configuration may lead
to a substantial increase in the attack’s success rate on the watermark detector. More details about
the adversarial attack can be found in Appendix A.3.

Figure 5 displays the AUROC of the methods following adversarial attacks using various adversarial perturbation budgets denoted as ϵ. StegaStamp demonstrates greater resilience to our attack,
requiring an ϵ value of 12/255 before its performance degrades to the level of a random detector.
We note that this level of adversarial noise may leave perceptible artifacts on the images. However,
TreeRing is found to be more vulnerable, as a perturbation budget as low as ϵ = 2/255 can render
Note that the transferability of the adversarial attacks is reliant on the
substitute classifier’s architecture and training procedure. In our case, we employ a basic ResNet-18
model with standard training procedures. Opting for a more suitable model configuration may lead
to a substantial increase in the attack’s success rate on the watermark detector. More details about
the adversarial attack can be found in Appendix A.3.

\epsilon=2/255

---

3.4 SPOOFING ATTACKS ON WATERMARKING METHODS

An effective watermarking method should minimize both spoofing and evasion errors. High spoofing errors enable adversaries to manipulate natural images, leading to a “spoofing attack”. Such
attacks can falsely identify obscene images as watermarked, potentially harming the reputation of
the developers of a watermarked generative model. In this section, we evaluate various watermarking techniques in the presence of adversarial spoofing attempts.

We use a simple strategy to spoof various watermarking techniques by blending watermarked noisy
images with clean images (see Algorithm 1). A detailed explanation of the attack is available in
Appendix A.4. Figure 7 shows examples of spoofed images for various watermarking methods.
While evaluating the AUROC metric, we also augment the images in our dataset using two different techniques: random cropping to 200×200-dimensional images and resizing back to 256×256-
dimensional images, and random rotations between -30 and 30 degrees. Figure 7 shows ROC curves
for our spoofing attack. As seen here, the AUROC and TPR at low FPR metrics of all the watermarking methods considered here drop after our spoofing attack. RivaGAN seems to be the most
robust to our spoofing attack. However, at low FPR regimes, some of the RivaGAN images can be
spoofed as well.

256\!\times\!256\

4 ROBUSTNESS-RELIABILITY TRADE-OFF OF DEEPFAKE DETECTORS

A reliable deepfake detector should exhibit the following two properties: (i) Robustness: Minor
input image perturbations should not influence performance. (ii) Reliability: The detector should
accurately identify fake images while minimizing false positives. In this section, we extend the
techniques used in proving Theorem 1 to show a fundamental trade-off between these two properties.
Let R and F denote the distributions of real and fake images. Consider a detector D that maps an

Let R and F denote the distributions of real and fake images. Consider a detector D that maps an
d l
input image x ∈ R to a latent representation ϕ(x) ∈ R that encodes the perceptual features of
the image and uses this representation for detection. We define the robustness of D as its ability
to correctly classify a noisy version of the image in this latent space. Let N (ϕ(x),σ) denote the
distribution of noisy versions of the image x in the latent space, where σ is a parameter representing
the size of the noise distribution. Here, N represents a general noise distribution with size parameter
σ. For example, N (ϕ(x),σ) could represent an isometric Gaussian distribution with variance σ2 or
a uniform distribution with width σ centered at ϕ(x).
Definition 3 (Robust Detector). We say a detector D is (σ,α)-robust on R and F under noise

\mathcal{R}

\mathcal{F}

x\in\mathbb{R}^{d}

\phi(x)\in\mathbb{R}^{\hat{l}}

{\mathcal{N}}(\phi(x),\sigma)

\check{\mathcal{M}}

\sigma

{\mathcal{N}}\ (\phi(x),\sigma)

\sigma

\sigma

\phi(x)

Definition 3 (Robust Detector). We say a detector D is (σ,α)-robust on R and F under noise
distribution N if, for an image x drawn from either R or F, its prediction is consistent on latent
representations from N (ϕ(x),σ) with probability at least (1 − α), for some α ≥ 0, i.e.,
h i

D

\mathcal{R}

(\sigma,\alpha)

\mathcal{N}

{\mathcal F},

\ 1-\alpha)

\forall k\in\{0,1\},\forall\mathcal{P}\in\{\mathcal{R},\mathcal{F}\},\quad\mathbb{P}_{x\sim\mathcal{P},\tilde{\phi}\sim\mathcal{N}(\phi(x),\sigma)}\left[D(\tilde{\phi})=k|D(\phi(x))=k\right]\geq1-\alpha.

\alpha\geq0,

This indicates a robust detector’s prediction should remain largely unchanged for noisy inputs.

(5)
Note that a concave upper bound like this always exists for any noise distribution N. This is because

Note that a concave upper bound like this always exists for any noise distribution N. This is because
the total variation between the noise distributions for two images goes from zero to one as the
distance between them in the latent space increases. Thus, a trivial bound could be obtained by
simply considering the convex hull of the region under the curve of the total variation with respect
to the distance. In the case where N is an isometric Gaussian and the distance is measured using the
ℓ2 norm, this bound takes the form of the Gauss error function, more precisely:
∥ϕ(x1) − ϕ(x2)∥

To measure the distance between two distributions R and F we use the Wasserstein metric, following a similar formulation as Equation 2. However, here, we define the distance with respect to a
l
norm ∥·∥ in the latent space R as follows:
W(R, F) = inf E(x,x)∼γ∥ϕ(x1) − ϕ(x2)∥ . (4)

x_{1}

\mathcal{N}(\phi(x_{1}),\sigma)

\bar{\mathcal{N}}(\phi(x_{2}),\sigma)

x_{2}

\mathbf{N}.

\dot{\mathsf{W}}(\mathcal{R},\mathcal{F})=\operatorname*{i n f}_{\gamma\in\Gamma(\mathcal{R},\mathcal{F})}\mathbb{E}_{(x_{1},x_{2})\sim\gamma}\big[\|\phi(x_{1})-\phi(x_{2})\|\big].

\mathbb{R}^{i}

---

Figure 8: Detection performance w.r.t robustness parameter σ for different values
of the Wasserstein distance between real R
and fake F distributions.

Detection performance w.r.t ro-Figure 9: AUROC vs. σ for a robust
for different values deepfake detector with ResNet-18 backbone
of the Wasserstein distance between real R on DeepFakes (deepfakes) and FaceSwap
(MarekKowalski) datasets.

Theorem 2. A (σ,α)-robust detector’s AUROC is upper bounded as follows:

(\sigma,\alpha)

\mathsf{A U R O C}(D)\leq\frac{1}{1-\alpha}\left(\psi_{\sigma}(\mathsf{W}_{\phi}(\mathcal{R},\mathcal{F}))-\frac{\psi_{\sigma}(\mathsf{W}_{\phi}(\mathcal{R},\mathcal{F}))^{2}}{2}\right)+\frac{1+2\alpha-2\alpha^{2}}{2(1-\alpha)}.

For example, when the Wasserstein distance is measured using ℓ2 in the latent space and the
noise is isometric √Gaussian with variance σ2, ψσtakes the form of the Gauss error function:
ψσ(z) = erf(z/(2 2σ). We set α to some small positive value (i.e., α = 1%) and analyze the
behavior of the bound for different values of σ. Figure 8 shows the behavior of the bound with respect to the robustness parameter σ for different values of the Wasserstein distance while Figure 16
shows the behavior of the bound with respect to the Wasserstein distance for different values of σ.
The detection performance bound has a negative relationship with the amount of noise that can be
tolerated.

\ell_{2}

\sigma^{2},\ \psi_{\sigma}

\psi_{\sigma}(z)=\mathsf{e r f}(z/(2\sqrt{2}\sigma)

\alpha

(\mathrm{i.e.,\ alpha\,=\,1\ \ \forall

\sigma

\sigma

\sigma\,

Experiments. We perform experiments on the images from the FaceForensics++ dataset hosted
by Rossler et al. (2019) to verify our theoretical insights empirically. ¨ We use ImageNet pretrained
ResNet-18 (He et al., 2015) (based on popular DeepFake detectors (Rossler et al., 2019; Dessa, ¨
2019)) and VGG-16-BN (Simonyan & Zisserman, 2014). More details on dataset preprocessing and
experiments are provided in Appendix F. We train the models to classify between real and synthetic
facial images. The initial trained layers of the models are fixed to be the latent representation ϕ given
in Equation 3. The remaining layers of the models represent detector D. For both ResNet-18 and
VGG-16-BN, we choose every layer except the last two convolution layer blocks to represent ϕ. Detectors with varying robustness to random noise are trained using noisy latent space feature vectors
output from ϕ. We train different detectors with the standard deviation of noise σ varied from 0 to
20. For different detectors, we compute the inference σ on the test dataset at which they achieve an α
of 0.01 using Equation 3. In Appendix F (Figure 18), we show that the detector’s robustness (inference σ at α = 1%) to random noise increases as the training sigma increases. We use ten randomly
sampled Gaussian noises for each sample ϕ(x) for this evaluation. After five independent trials, we
plot AUROC vs. σ for various (σ,α = 0.01)-robust detectors in Figure 9 using a ResNet-18 backbone for the detector (see plot using VGG-16-BN in Figure 17). Our empirical results show that as
the robustness or σ at fixed α increases, the AUROC or the performance of the detectors drops.

\phi

5 CONCLUSION

\phi

\phi

\sigma

\sigma

\sigma

\overset{\mathfrakarrow}{\sigma.}alpha=0.01)

\alpha=1\%

---

Published as a conference paper at ICLR 2024

# 6 ETHICS STATEMENT

In our research, we follow academic integrity and responsible AI practices. We aim to contribute to discussions on the security of detecting AI-generated content. We prioritize ethical considerations and focus on the societal impact of our findings. Our commitment is to transparency and aware- ness in the evolving field of generative AI technologies, with the goal of preventing misuse while encouraging progress.

# REFERENCES

Belhassen Bayar and Matthew C Stamm. A deep learning approach to universal image manipu- lation detection using a new convolutional layer. In Proceedings of the 4th ACM workshop on information hiding and multimedia security, pp. 5–10, 2016.

Ta´ıs Fernanda Blauth, Oskar Josef Gstrein, and Andrej Zwitter. Artificial intelligence crime: An overview of malicious use and abuse of ai. IEEE Access, 10:77110–77122, 2022. doi: 10.1109/ ACCESS.2022.3191790.

FRANCIS MORGAN Boland, Joseph JK O’Ruanaidh, and C Dautzenberg. Watermarking digital images for copyright protection. 1995.

Mattia Bonomi, Cecilia Pasquini, and Giulia Boato. Dynamic texture analysis for detecting fake faces in video sequences. J. Vis. Commun. Image Represent., 79:103239, 2021. doi: 10.1016/j. jvcir.2021.103239. URL [https://doi.org/10.1016/j.jvcir.2021.103239](https://doi.org/10.1016/j.jvcir.2021.103239).

Chin-Chen Chang, Piyu Tsai, and Chia-Chen Lin. Svd-based digital image watermarking scheme. Pattern Recognition Letters, 26(10):1577–1586, 2005.

Robert Chesney and Danielle Citron. Deepfakes and the new disinformation war: The coming age of post-truth geopolitics. Foreign Affairs, 98(1):147, Jan 2019. URL [https://www.proquest](https://www.proquest). com/magazines/deepfakes-new-disinformation-war-coming-age-post/ docview/2161593888/se-2. Copyright-Copyright Council on Foreign Relations NY Jan/Feb 2019; Last updated - 2022-11-09.

Franc¸ois Chollet. ” xception: Deep learning with depthwise separable convolutions”, arxiv preprint. arXiv preprint arXiv:1610.02357, 2016.

Umur Aybars Ciftci and Ilke Demir. Fakecatcher: Detection of synthetic portrait videos using biological signals. CoRR, abs/1901.02212, 2019. URL [http://arxiv.org/abs/1901](http://arxiv.org/abs/1901). 02212.

Ingemar Cox, Matthew Miller, Jeffrey Bloom, Jessica Fridrich, and Ton Kalker. Digital Watermark- ing and Steganography. Morgan Kaufmann Publishers Inc., San Francisco, CA, USA, 2 edition,

2007. ISBN 9780080555805.
Ingemar J Cox, Joe Kilian, Tom Leighton, and Talal Shamoon. Secure spread spectrum watermark- ing for images, audio and video. In Proceedings of 3rd IEEE international conference on image processing, volume 3, pp. 243–246. IEEE, 1996.

Davide Cozzolino, Giovanni Poggi, and Luisa Verdoliva. Recasting residual-based local descriptors as convolutional neural networks: an application to image forgery detection. In Proceedings of the 5th ACM workshop on information hiding and multimedia security, pp. 159–164, 2017.

Yingqian Cui, Jie Ren, Han Xu, Pengfei He, Hui Liu, Lichao Sun, and Jiliang Tang. Diffusion- shield: A watermark for copyright protection against generative diffusion models. arXiv preprint arXiv:2306.04642, 2023.

## deepfakes. Deepfakes. URL [https://github.com/deepfakes/faceswap](https://github.com/deepfakes/faceswap).

Dessa. Towards deepfake detection that actually works. Novem- ber 2019. URL [https://medium.com/dessa-news/](https://medium.com/dessa-news/) towards-deepfake-detection-that-actually-works-ab10d33efce9.

---

Published as a conference paper at ICLR 2024

Pantelis Dogoulis, Giorgos Kordopatis-Zilos, Ioannis Kompatsiaris, and Symeon Papadopoulos. Im- proving synthetically generated image detection in cross-concept settings. In Proceedings of the 2nd ACM International Workshop on Multimedia AI against Disinformation, pp. 28–35, 2023.

Michael Elad, Bahjat Kawar, and Gregory Vaksman. Image denoising: The deep learning revolution and beyond—a survey paper. SIAM Journal on Imaging Sciences, 16(3):1594–1654, 2023.

Patrick Esser, Robin Rombach, and Bjorn Ommer. Taming transformers for high-resolution image synthesis. In Proceedings of the IEEE/CVF conference on computer vision and pattern recogni- tion, pp. 12873–12883, 2021.

Kazem Ghazanfari, Shahrokh Ghaemmaghami, and Saeed R Khosravi. Lsb++: An improvement to lsb+ steganography. In TENCON 2011-2011 IEEE Region 10 Conference, pp. 364–368. IEEE,

2011.
Luca Guarnera, Oliver Giudice, and Sebastiano Battiato. Fighting deepfake by exposing the convo- lutional traces on images. IEEE Access, 8:165085–165098, 2020. doi: 10.1109/ACCESS.2020. 3023037. URL [https://doi.org/10.1109/ACCESS.2020.3023037](https://doi.org/10.1109/ACCESS.2020.3023037).

Alexandros Haliassos, Konstantinos Vougioukas, Stavros Petridis, and Maja Pantic. Lips don’t lie: A generalisable and robust approach to face forgery detection. In IEEE Conference on Computer Vision and Pattern Recognition, CVPR 2021, virtual, June 19-25, 2021, pp. 5039–

5049. Computer Vision Foundation / IEEE, 2021. doi: 10.1109/CVPR46437.2021.00500. URL [https://openaccess.thecvf.com/content/CVPR2021/html/Haliassos_](https://openaccess.thecvf.com/content/CVPR2021/html/Haliassos_) Lips_Dont_Lie_A_Generalisable_and_Robust_Approach_To_Face_CVPR_ 2021_paper.html.
Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun. Deep residual learning for image recog- nition. corr abs/1512.03385 (2015), 2015.

Todd C. Helmus. Artificial Intelligence, Deepfakes, and Disinformation: A Primer. RAND Corpo- ration, Santa Monica, CA, 2022. doi: 10.7249/PEA1043-1.

Jonathan Ho, Ajay Jain, and Pieter Abbeel. Denoising diffusion probabilistic models. In

H. Larochelle, M. Ranzato, R. Hadsell, M.F. Balcan, and H. Lin (eds.), Advances in Neu- ral Information Processing Systems, volume 33, pp. 6840–6851. Curran Associates, Inc.,
2020. URL [https://proceedings.neurips.cc/paper_files/paper/2020/](https://proceedings.neurips.cc/paper_files/paper/2020/) file/4c5bcfec8584af0d967f1ab10179ca4b-Paper.pdf.
Vojtech Holub and Jessica Fridrich. Designing steganographic distortion using directional filters. In ˇ 2012 IEEE International workshop on information forensics and security (WIFS), pp. 234–239. IEEE, 2012.

Chris Honsinger. Digital watermarking. Journal of Electronic Imaging, 11(3):414–414, 2002.

Jessica L. Ice. Defamatory political deepfakes and the first amendment. Case Western Reserve law review, 70:417, 2019.

Zhaoyang Jia, Han Fang, and Weiming Zhang. Mbrs: Enhancing robustness of dnn-based water- marking by mini-batch of real and simulated jpeg compression. In Proceedings of the 29th ACM international conference on multimedia, pp. 41–49, 2021.

Zhengyuan Jiang, Jinghuai Zhang, and Neil Zhenqiang Gong. Evading watermark based detection of ai-generated content. arXiv preprint arXiv:2305.03807, 2023.

Junnan Li, Dongxu Li, Caiming Xiong, and Steven Hoi. Blip: Bootstrapping language-image pre- training for unified vision-language understanding and generation, 2022.

Xiaodan Li, Yining Lang, Yuefeng Chen, Xiaofeng Mao, Yuan He, Shuhui Wang, Hui Xue, and Quan Lu. Sharp multiple instance learning for deepfake video detection. In Chang Wen Chen, Rita Cucchiara, Xian-Sheng Hua, Guo-Jun Qi, Elisa Ricci, Zhengyou Zhang, and Roger Zimmermann (eds.), MM ’20: The 28th ACM International Conference on Multimedia, Virtual Event / Seattle, WA, USA, October 12-16, 2020, pp. 1864–1872. ACM, 2020. doi: 10.1145/3394171.3414034. URL [https://doi.org/10.1145/3394171.3414034](https://doi.org/10.1145/3394171.3414034).

---

Published as a conference paper at ICLR 2024

Calvin Luo. Understanding diffusion models: A unified perspective. arXiv preprint arXiv:2208.11970, 2022.

Aleksander Madry, Aleksandar Makelov, Ludwig Schmidt, Dimitris Tsipras, and Adrian Vladu. Towards deep learning models resistant to adversarial attacks. arXiv preprint arXiv:1706.06083,

2017.
## MarekKowalski. Faceswap. URL [https://github.com/MarekKowalski/FaceSwap/](https://github.com/MarekKowalski/FaceSwap/).

Falko Matern, Christian Riess, and Marc Stamminger. Exploiting visual artifacts to expose deep- fakes and face manipulations. In 2019 IEEE Winter Applications of Computer Vision Workshops (WACVW), pp. 83–92, 2019. doi: 10.1109/WACVW.2019.00020.

Weili Nie, Brandon Guo, Yujia Huang, Chaowei Xiao, Arash Vahdat, and Anima Anandkumar. Diffusion models for adversarial purification. arXiv preprint arXiv:2205.07460, 2022.

Joseph JK O’Ruanaidh and Thierry Pun. Rotation, scale and translation invariant digital image watermarking. In Proceedings of International Conference on Image Processing, volume 1, pp. 536–539. IEEE, 1997.

Toma´s Pevn ˇ y, Tom ` a´s Filler, and Patrick Bas. ˇ Using high-dimensional image models to perform highly undetectable steganography. In Information Hiding: 12th International Conference, IH 2010, Calgary, AB, Canada, June 28-30, 2010, Revised Selected Papers 12, pp. 161–177. Springer, 2010.

V.M. Potdar, S. Han, and E. Chang. A survey of digital image watermarking techniques. In IN- DIN ’05. 2005 3rd IEEE International Conference on Industrial Informatics, 2005., pp. 709–716,
2005. doi: 10.1109/INDIN.2005.1560462.
Nicolas Rahmouni, Vincent Nozick, Junichi Yamagishi, and Isao Echizen. Distinguishing computer graphics from natural images using convolution neural networks. In 2017 IEEE workshop on information forensics and security (WIFS), pp. 1–6. IEEE, 2017.

Kiran Raja, Sushma Venkatesh, RB Christoph Busch, et al. Transferable deep-cnn features for detecting digital and print-scanned morphed face images. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition Workshops, pp. 10–18, 2017.

Robin Rombach, Andreas Blattmann, Dominik Lorenz, Patrick Esser, and Bjorn Ommer. ¨ High- resolution image synthesis with latent diffusion models. In Proceedings of the IEEE/CVF confer- ence on computer vision and pattern recognition, pp. 10684–10695, 2022.

Andreas Rossler, Davide Cozzolino, Luisa Verdoliva, Christian Riess, Justus Thies, and Matthias ¨ Nießner. FaceForensics++: Learning to detect manipulated facial images. In International Con- ference on Computer Vision (ICCV), 2019.

Olga Russakovsky, Jia Deng, Hao Su, Jonathan Krause, Sanjeev Satheesh, Sean Ma, Zhiheng Huang, Andrej Karpathy, Aditya Khosla, Michael Bernstein, et al. Imagenet large scale visual recognition challenge. International journal of computer vision, 115:211–252, 2015.

Christoph Schuhmann, Richard Vencu, Romain Beaumont, Robert Kaczmarczyk, Clayton Mullis, Aarush Katta, Theo Coombes, Jenia Jitsev, and Aran Komatsuzaki. Laion-400m: Open dataset of clip-filtered 400 million image-text pairs, 2021.

Jin S Seo, Jaap Haitsma, Ton Kalker, and Chang D Yoo. A robust image fingerprinting system using the radon transform. Signal Processing: Image Communication, 19(4):325–339, 2004.

Ali Shafahi, Mahyar Najibi, Amin Ghiasi, Zheng Xu, John Dickerson, Christoph Studer, Larry S. Davis, Gavin Taylor, and Tom Goldstein. Adversarial training for free!, 2019.

Karen Simonyan and Andrew Zisserman. Very deep convolutional networks for large-scale image recognition. arXiv preprint arXiv:1409.1556, 2014.

M.D. Swanson, M. Kobayashi, and A.H. Tewfik. Multimedia data-embedding and watermarking technologies. Proceedings of the IEEE, 86(6):1064–1087, 1998. doi: 10.1109/5.687830.

---

Matthew Tancik, Ben Mildenhall, and Ren Ng. Stegastamp: Invisible hyperlinks in physical photographs. In Proceedings of the IEEE/CVF conference on computer vision and pattern recognition, pp. 2117–2126, 2020.
Chunpeng Wang, Qixian Hao, Shujiang Xu, Bin Ma, Zhiqiu Xia, Qi Li, Jian Li, and Yun-Qing Shi.
Rd-iwan: Residual dense based imperceptible watermark attack network. IEEE Transactions on
Circuits and Systems for Video Technology, 32(11):7460–7472, 2022a. doi: 10.1109/TCSVT.
2022.3188524.
Yinhuai Wang, Jiwen Yu, and Jian Zhang. Zero-shot image restoration using denoising diffusion
null-space model. arXiv preprint arXiv:2212.00490, 2022b.
Yuxin Wen, John Kirchenbauer, Jonas Geiping, and Tom Goldstein. Tree-ring watermarks: Fingerprints for diffusion images that are invisible and robust. arXiv preprint arXiv:2305.20030,
2023.
Raymond B Wolfgang and Edward J Delp. A watermark for digital images. In Proceedings of 3rd
IEEE International Conference on Image Processing, volume 3, pp. 219–222. IEEE, 1996.
Kevin Alex Zhang, Alfredo Cuesta-Infante, Lei Xu, and Kalyan Veeramachaneni. Steganogan: High
capacity image steganography with gans. arXiv preprint arXiv:1901.03892, 2019a.
Kevin Alex Zhang, Lei Xu, Alfredo Cuesta-Infante, and Kalyan Veeramachaneni. Robust invisible
video watermarking with attention. CoRR, abs/1909.01285, 2019b. URL http://arxiv.
org/abs/1909.01285.
Kevin Alex Zhang, Lei Xu, Alfredo Cuesta-Infante, and Kalyan Veeramachaneni. Robust invisible
video watermarking with attention. arXiv preprint arXiv:1909.01285, 2019c.
Xuandong Zhao, Kexun Zhang, Zihao Su, Saastha Vasan, Ilya Grishchenko, Christopher Kruegel,
Giovanni Vigna, Yu-Xiang Wang, and Lei Li. Invisible image watermarks are provably removable
using generative ai, 2023a.
Yunqing Zhao, Tianyu Pang, Chao Du, Xiao Yang, Ngai-Man Cheung, and Min Lin. A recipe for
watermarking diffusion models. arXiv preprint arXiv:2303.10137, 2023b.
Zhengyue Zhao, Jinhao Duan, Xing Hu, Kaidi Xu, Chenan Wang, Rui Zhang, Zidong Du, Qi Guo,
and Yunji Chen. Unlearnable examples for diffusion models: Protect data from unauthorized
exploitation. arXiv preprint arXiv:2306.01902, 2023c.
Peng Zhou, Xintong Han, Vlad I Morariu, and Larry S Davis. Two-stream neural networks for
tampered face detection. In 2017 IEEE conference on computer vision and pattern recognition
workshops (CVPRW), pp. 1831–1839. IEEE, 2017.

---

| Method | Image $\ell_{2}$ distance | Latent $\ell_{2}$ distance |
| --- | --- | --- |
| RivaGAN(Zhang et al.,2019b) | 4.19 | 8.47 |
| DwtDct(Cox et al.,2007) | 5.59 | 5.47 |
| DwtDctSvd(Cox et al.,2007) | 5.54 | 6.67 |
| WatermarkDM(Zhao et al.,2023b) | 7.26 | 13.84 |
| StegaStamp(Tancik et al.,2020) | 17.40 | 118.17 |
| TreeRing(Wen et al.,2023) | 117.58 | 52.81 |

\ell_{2}

\ell_{2}

Table 1: Average ℓ2 distance between corresponding watermarked and non-watermarked images for
each method. The latent representations were obtained using a VQGAN model (Esser et al., 2021),
commonly used for latent diffusion models. We consider the first four methods as low perturbation,
and the last two as high perturbation ones.

\ell_{2}

Figure 10: ROC curves for watermarking methods against diffusion purification attack with different
values of t.

A.1 DIFFUSION PURIFICATION ATTACK

Note that the quality of images for the TreeRing watermark depends on the captions that are provided for the images, and in our case, we are using simple captions based on ImageNet classes.
Therefore, the images watermarked by TreeRing might exhibit dissimilarity compared to their nonwatermarked counterparts. However, this does not influence the results when attacking the TreeRing

A COMPLEMENTARY RESULTS FOR WATERMARKING METHODS

---

Published as a conference paper at ICLR 2024

2ULJLQDO DwtDct DwtDctSVD 5LYD*$1 WDWHUPDUN'0 6WHJD6WDPS TUHH5LQJ

2ULJLQDO DwtDct DwtDctSVD 5LYD*$1 WDWHUPDUN'0 6WHJD6WDPS TUHH5LQJ

Figure 11: Watermarked images subjected to the image diffusion purification attack are shown with

varying values of the parameter t. For t = 0.3, the attack may excessively alter images, making it unsuitable for some applications.

---

| Method | PSNR |  |  | SSIM |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| t=0.1 | t=0.2 | t=0.3 | t=0.1 | t=0.2 | t=0.3 |  |
| RivaGAN | 29.77 | 26.10 | 23.61 | 0.83 | 0.72 | 0.63 |
| DwtDct | 29.64 | 26.03 | 23.70 | 0.83 | 0.72 | 0.63 |
| DwtDctSvd | 29.69 | 26.08 | 23.60 | 0.83 | 0.72 | 0.63 |
| WatermarkDM | 30.33 | 26.41 | 23.87 | 0.86 | 0.75 | 0.66 |
| MBRS | 29.96 | 26.23 | 23.76 | 0.83 | 0.73 | 0.64 |
| StegaStamp | 30.35 | 26.52 | 24.08 | 0.84 | 0.73 | 0.64 |
| TreeRing | 32.45 | 28.27 | 25.49 | 0.92 | 0.86 | 0.81 |

t=0.1

t=0.2

t=0.3

t=0.1

t=0.3

Table 2: Analysis of the quality of images after being attacked using diffusion purification.

Figure 12: AUROC of watermarking methods against latent diffusion purification attack w.r.t the value of t.

Figure 13: ROC curves for attacking watermarked and non-watermarked images
that are generated with text from LAIONcaptions with the TreeRing method.

watermark. Nevertheless, in Fig 13, we demonstrate that our adversarial attacks on TreeRing also
extend successfully to captions from LAION-captions data.

A.2 LATENT DIFFUSION PURIFICATION ATTACK

A similar bound from Theorem 1 can be proven for latent diffusion models. The diffusion process
for a latent diffusion model consists of: mapping x0 to the latent space, i.e., z0 = ϕ(x0); calculating
out out out
z0 ∼ DPt(z0) using a latent diffusion model; and mapping z0 back to image space, i.e., x0=
−1 out
ϕ (z0). In this case, since the noise is applied to latent space ϕ, the Wasserstein distance in
Theorem 1 will be replaced by the Wasserstein distance of the latent distributions, i.e., W(Rϕ, Fϕ)
with Rϕbeing the distribution of images z0 = ϕ(x0) where x0 ∼R, and Fϕdefined similarly.
In practice, we perform latent diffusion purification attack by employing a Text-Guided Image-

z_{0Omega}=\\phi(x_{0Omega}]

z_{0}^{o u t}\sim D P_{t}(z_{0})

x_{0}^{o u t}=

z_{0}^{o u t}

\mathring{\phi}^{-1}(z_{0}^{o u t})

\mathcal{R}_{\phi}

z_{0}=\phi(x_{0})

x_{0}\sim\mathcal{R}

\mathcal{F}_{\phi}

\mathsf{W}(\mathcal{R}_{\phi},\mathcal{F}_{\phi})

In practice, we perform latent diffusion purification attack by employing a Text-Guided Imageto-Image Stable Diffusion model (Rombach et al., 2022), and using BLIP model (Li et al., 2022)
to generate image captions, as guidance for diffusion models. Figure 12 includes the AUROC of
watermarking methods against this attack, and Figure 14 contains samples output images for this
attack.

---

Published as a conference paper at ICLR 2024

2ULJLQDO DwtDct DwtDctSVD 5LYD*$1 W DWHUPDUN'0 6WHJD6WDPS T UHH5LQJ

Figure 14: Watermarked Images subjected to the latent diffusion purification attack are shown with

varying values of the parameter t. For t = 0.5, the attack drastically changes the images in most cases (except for TreeRing).

---

Published as a conference paper at ICLR 2024

## W DWHUPDUNHGPerturbation Pattern

## T UHH5LQJ

***6WHJD6WDPS***

Figure 15: Watermarked images subjected to the model substitution adversarial attack are shown

with varying values of adversarial perturbation budget ϵ. Attacks on images watermarked with the same method show similar perturbation patterns.

For StegaStamp, we employ 100-bit binary keys, mirroring the key length described in their report. In the case of TreeRing, we stick to the ring-type key employed in the original implementation. TreeRing necessitates captions for generating watermark images, and for our ImageNet data, we utilize captions structured as “a photo of a ⟨imagenet-class⟩.” Nevertheless, in Figure 13, we demon- strate that our attacks on TreeRing also extend successfully to LAION-captions data (Schuhmann et al., 2021).

Our substitute classifiers are trained for 10 epochs and receive higher than 99.8% accuracy on val- idation data. For StegaStamp, we observed that augmenting the training data with Gaussian noise improves the transferability of the attacks on the watermark detector.

To launch adversarial attacks on images using substitute classifiers, we employ a PGD attack with 300 iterations and a step size denoted as α = 0.05ϵ. Our observations indicate that adversarial per- turbations for a particular watermarking method exhibit a roughly consistent pattern. Consequently, we initiate our adversarial attacks on each image from the perturbation discovered for the previous image, a technique akin to the one employed in Shafahi et al. (2019). To ensure the accurate identi- fication of the perturbation pattern, we execute a series of preliminary warm-up attacks at the outset. Some sample adversarial images can be seen in Figure 15.

In Figure 13, we present ROC curves for attacking TreeRing images that are generated with text from LAION-captions data (Schuhmann et al., 2021). This shows that our adversarial attack which is performed on the classifier trained on ImageNet data, generalizes to any images watermarked using the TreeRing method.

A.4 SPOOFING To perform the spoofing attack, we first generate random noisy images where pixels are drawn from different Gaussian distributions with varying standard deviations. The noisy images are normalized

---

| Method |  | Base | Blur(k=5) | JPEG | DiffPure(t=0.2) |
| --- | --- | --- | --- | --- | --- |
| RivaGAN | t=0.1 | 0.655 | 0.692 | 0.679 | 0.638 |
| t=0.2 | 0.623 | 0.607 | 0.604 | 0.593 |  |
| t=0.3 | 0.579 | 0.568 | 0.562 | 0.555 |  |
| DwtDct | t=0.1 | 0.548 | 0.546 | 0.544 | 0.542 |
| t=0.2 | 0.542 | 0.540 | 0.539 | 0.539 |  |
| t=0.3 | 0.539 | 0.538 | 0.538 | 0.537 |  |
| DwtDctSvd | t=0.1 | 0.560 | 0.566 | 0.567 | 0.567 |
| t=0.2 | 0.564 | 0.560 | 0.561 | 0.558 |  |
| t=0.3 | 0.555 | 0.553 | 0.551 | 0.549 |  |
| WatermarkDM | t=0.1 | 0.876 | 0.885 | 0.805 | 0.597 |
| t=0.2 | 0.644 | 0.630 | 0.604 | 0.518 |  |
| t=0.3 | 0.568 | 0.604 | 0.565 | 0.564 |  |
| MBRS | t=0.1 | 0.914 | 0.828 | 0.874 | 0.597 |
| t=0.2 | 0.614 | 0.636 | 0.634 | 0.545 |  |
| t=0.3 | 0.536 | 0.493 | 0.444 | 0.547 |  |
| StegaStamp | t=0.1 | 1.000 | 1.000 | 0.998 | 0.920 |
| t=0.2 | 0.966 | 0.960 | 0.971 | 0.832 |  |
| t=0.3 | 0.781 | 0.802 | 0.767 | 0.659 |  |
| TreeRing | t=0.1 | 0.996 | 0.989 | 0.947 | 0.935 |
| t=0.2 | 0.976 | 0.956 | 0.923 | 0.912 |  |
| t=0.3 | 0.928 | 0.907 | 0.871 | 0.876 |  |

Table 3: The AUROC of watermarking methods against diffusion purification attack, after applying
post-attack mitigations to the attacked images.

to have values between 0 and 1. For every watermarking method that we evaluate, we apply their
watermarks on these noisy images to obtain corresponding watermarked noisy images.

watermarks on these noisy images to obtain corresponding watermarked noisy images.
We use an input prompt, “a noisy image”, along with the noisy images to generate noisy watermarked TreeRing (Wen et al., 2023) images. Once we obtain the watermarked noisy images, we
do a mixup (or image blending) by adding noisy images to the clean images to spoof them. We
observe that the watermark signatures in the noisy images help detect the resulting blended images
as watermarked.

We provide the pseudocode for spoofing watermarks in Algorithm 1.

Algorithm 1 Watermark Spoofing
Require: clean image x, watermarking model W, mixup parameter α
z = random(x.shape) ▷ generate random noise with shape of image x
z = z − z.min() ▷ normalize z
z = z/z.max()
z = αW (z) ▷ watermark the noise; for TreeRing, condition with text “a noisy image”
γ = 1 − z.max()
x = γx/x.max() ▷z + x can now only have a value of maximum 1
return x + z ▷ spoofed image

In this section, we measure the robustness of the diffusion purification and the model substitution
adversarial attacks on image watermarking techniques. This robustness is measured by applying
post-attack mitigations such as Gaussian Blur and JPEG Compression to the attacked images. A
robust attack is expected to result in a low AUROC on the watermark detector, even after the postattack mitigations are applied.

\alpha

z=\alpha\mathcal{W}(z)

---

| Method |  | Base | Blur(k=5) | Blur(k=15) | JPEG | DiffPure(t=0.2) |
| --- | --- | --- | --- | --- | --- | --- |
| StegaStamp | $\epsilon=4$ | 1.000 | 1.000 | 0.999 | 0.991 | 0.879 |
| $\epsilon=8$ | 0.923 | 0.838 | 0.791 | 0.864 | 0.703 |  |
| $\epsilon=12$ | 0.492 | 0.424 | 0.341 | 0.496 | 0.566 |  |
| TreeRing | $\epsilon=4$ | 0.035 | 0.025 | 0.023 | 0.046 | 0.891 |
| $\epsilon=8$ | 0.002 | 0.001 | 0.001 | 0.006 | 0.531 |  |
| $\epsilon=12$ | 0.001 | 0.0002 | 0.0002 | 0.001 | 0.074 |  |

(t=0.2)

Table 4: The AUROC of watermarking methods against model substitution adversarial attack, after
applying post-attack mitigations to the attacked images.

Table 3 showcases the AUROC of watermarking methods against diffusion purification attacks, after
applying post-attack mitigations. The application of post-attack mitigations is not causing significant
increases in the AUROC. This is anticipated since the primary aim of the diffusion purification attack
is the removal of watermarks from the watermarked images (i.e., to achieve a bit-accuracy close to
0.5 for both watermarked and non-watermarked images). Therefore, it is reasonable to expect that
basic no-box post-attack mitigations will encounter challenges in recovering the watermark.

On the other hand, our proposed adversarial attack has black-box information about the watermark,
and therefore, is able to target both non-watermarked and watermarked images for its attack, in order
to increase or reduce their watermark bit-accuracy, respectively. Table 4 showcases the AUROC of
watermarking methods against the adversarial attack, after applying post-attack mitigations. While
post-attack mitigations, specifically DiffPure, are able to increase the AUROC in some cases, they
fail to negate the effect of the attack for higher attack budgets such as ϵ = 8/255.

\epsilon=8/255

B PROOF OF THEOREM 1

\mathcal{R}^{t}

t
Statement. The sum of evasion and spoofing errors of a watermark detector D on distributions R
t
and F is lower bounded as follows:
√

e_{0}(\mathcal{F}^{t},D)+e_{1}(\mathcal{R}^{t},D)\geq1-\mathsf{e r f}(\frac{\sqrt{\bar{\alpha_{t}}}\:{\mathsf{W}}(\mathcal{R},\mathcal{J}}{2\sqrt{2(1-\bar{\alpha_{t}}}}}

Proof. Let ψσ(·) denote a concave upper bound on the total variation between two noise distributions N (x1,σ) and N (x2,σ) as a function of the distance ∥x1 − x2∥ between the corresponding
images, i.e.,
TV N (x1,σ), N (x2,σ) ≤ ψ ∥x1 − x2∥ , (6)

\psi_{\sigma}(\cdot)

\mathcal{N}(x_{1},\sigma)

\mathcal{N}(x_{2},\sigma)

\mathcal{R}_{N}

x\sim\mathcal{R}.

Note that a concave upper bound like this always exists for any noise distribution N. This is because the total variation of the noise distributions for two images goes from zero to one as the
distance between them in the latent space increases. Thus a trivial bound could be obtained by simply considering the convex hull of the region under the curve of the total variation with respect to
the distance. In the case where N is an isometric Gaussian and the distance is measured using the
ℓ2-norm, this bound takes the form of the Gauss error function, more precisely:

\left\|x_{1}-x_{2}\right\|

\tilde{x}\sim\mathcal{N}(x,\sigma)

\mathsf{T V}\left(\mathcal{N}(x_{1},\sigma),\mathcal{N}(x_{2},\sigma)\right)\leq\psi_{\sigma}\left(||x_{1}-x_{2}||\right),

where TV is the total variation of two distributions.

\mathcal{F}_{N}

\mathcal{F}

\ell_{2}

x_{2}

{cal F\}},

\psi_{\sigma}\big(\mathsf{W}(\mathcal{R},\mathcal{F})\big)=\mathsf{e r f}\left(\frac{\mathsf{W}(\mathcal{R},\mathcal{F})}{2\sqrt{2}\sigma}\right).

---

We bound the total variation of the noisy distributions RNand FNin terms of the Wasserstein
distance between the original distributions R and F. The reason why this bound holds is that as R
and F get closer to each other, RNand FNstart to overlap due to the noise distribution N around
them.

\mathcal{R}_{N}

\mathcal{F}_{\mathcal{N}}

\mathcal{R}

\mathcal{R}_{N}

\mathcal{F}

\mathcal{F}_{\mathcal{N}}

\mathcal{R}

\mathcal{F}

\mathcal{N}

Lemma 1. The total variation of RNand FN, and hence, the success rate of any detector D
on these distributions, is upper bounded by a function of the Wasserstein distance of the original
distributions R and F as follows:

\mathcal{R}_{\mathcal{N}}

\mathcal{F}_{N}

D

\mathcal{F}

1-(e_{0}(\mathcal{F}_{\mathcal{N}},D)+e_{1}(\mathcal{R}_{\mathcal{N}},D))\leq\left{\mathsf{T V}(\mathcal{R}_{\mathcal{N}},\mathcal{F}_{\mathcal{N}})\leq\ \ psi{{\ }}}\right.\

Proof. For simplicity of the proof, assume D to be deterministic, however, the proof can be generalized for randomized detectors too. Define ED= {x : D(x) = 1}. Based on the definition of total
variation,

E_{D}=\left\{x:D(x)=1\right\}

\begin{aligned}{\mathsf{T V}(\mathcal{R_{N}},\mathcal{F_{N}})}&{{}=\operatorname*{s u p}_{E}\left\ \ \ mathbb P{}_{\tilde{x}_{1}\sim\mathcal{R_{N}}}[\tilde{x}_{1}\in E]-\mathbb{}mathbb}_{\tilde{x}_{2}\sim\mathcal{F_{N}}}\lbrack tilde x{}_{2}\in E\rbrack\right\vert}\\ {}&{{}\geq\left\vert\mathbb{P}_{\tilde{x}_{1}\sim\mathcal{R_{N}}}[\tilde{x}_{1}\in E_{D}]-\mathbb{P}_{\tilde{x}_{2}\sim\mathcal{F_{N}}}[\tilde{x}_{2}\in E_{D}]\right\vert}\\ {}&{{}=\left vert e_{1}(\mathcal{R_{N}},D)-\big(1-e_{0}(\mathcal{F_{N}},D)\big)\right\vert}\\ {}&{{}\geq1-(e_{0}(\mathcal{F_{N}},D)+e_{1}(\mathcal{R_{N}},D)).}\\ \end{aligned}

(Definition 1)

Furthermore, the inequality TV(RN, FN) ≤ ψσW(R, F) can be derived from the proof presented for Lemma 3 in Appendix E, by substituting the latent function ϕ with the identity function.

\mathsf{T V}(\mathcal{R}_{\mathcal{N}},\mathcal{F}_{\mathcal{N}})\leq\psi_{\sigma}(\mathsf{M}(\mathcal{R},\mathcal{F}))

\phi

In Lemma 1, we have shown that after applying Gaussian noise to R and F, they become more indistinguishable. However, using Gaussian noise as an attack against image watermarks will degrade
the quality of images. Therefore, we utilize denoising diffusion models to remove the added noise.
Since the bound in Lemma 1 is on total variation, by applying a denoising function on the noisy
distributions RNand FN, the bound still holds. Note that our theoretical results do not rely on the
utilization of denoising diffusion models, and any arbitrary denoising technique (Elad et al., 2023;
Wang et al., 2022b), can be used to achieve similar bounds.
√
tN t

\mathcal{R}

\mathcal{R}_{\mathcal{N}}

√
tN t
Let R be the distribution of xt∼N ( α¯tx0, (1 − α¯t)I) where x0 ∼R, and define FNsimilarly.
t tN t
Additionally, define G (.) as the function that performs denoising process to R and FN(i.e.,
t out t tN
samples of R come from x0∼ G (xt) where xt∼R).
p

\mathcal{R}_{N}^{t}

\ \ x{_{it t}}}\sim\ {{\mathcal{N}}}\ {\bigl(}\ \sqrt{{{{\bar{\alpha}}_{t}}}}}&{{}\ {{\ (\o{1}}-{{{\bar{\alpha}}_{t}}})}\ I\\ )

\mathcal{F}_{N}^{t}

G^{t}(.)

\mathcal{R}_{N}^{t}

\mathcal{F}_{N}^{t}

\mathcal{R}^{t}

x_{t}\sim\mathcal{R}_{\mathcal{N}}^{t})

p
tN t
We use Lemma 1, to get an upper bound on the total variation of R and FN, with σ = (1 − α¯t),
tN t
based on the definition of R and FN:
tN t

.\mathcal{F}_{\mathcal{N}}^{t}

(Equation 8)

\sigma=\sqrt{(1-\bar{\alpha_{t}})}

\mathcal{R}_{N}^{\tilde{t}}

\begin{aligned}{}&{{}\mathsf{T V}(\mathcal{R}^{t},\mathcal{F}^{t})\leq\mathsf{T V}(\mathcal{R}_{\mathcal{N}}^{t},\mathcal{F}_{\mathcal{N}}^{t})\leq\mathsf{e r f}(\frac{\sqrt{\bar{\alpha}_{t}}\ mathsf W\((mathcalmathcal{R},\mathcal{F})}{2\sqrt{2(1-\bar{\alpha}_{t})}})}\\ {}&{{}\quad1-(e_{0}(\mathcal{F}^{t},D)+e_{1}(\mathcal{R}^{t},D))\leq\mathsf{e r f}(\frac{\sqrt{\bar{\alpha}_{t}}\mathsf W\big(\mathcal{R},\mathcal{F}\big}{2\sqrt{2(1-\bar{\alpha}_{t})}})}\\ {}&{{}\qquad\qquad e_{0}(\mathcal{F}^{t},D)+e_{1}(\mathcal{R}^{t},D)\geq1-\mathsf{e r f}(\frac{\sqrt{\bar{\alpha}_{t}}\mathsf W(\mathcal{R},\mathcal{F})}{2\sqrt{2(1-\bar{\alpha}_{t})}}).}\\ \end{aligned}

\mathcal{F}_{\Lambda\Gamma}^{t}

\begin{aligned}{\ddot{\mathsf{T V}}(\ddot{\mathcal{R}_{\mathcal{N}}^{t}},\mathcal{F}_{\mathcal{N}}^{t})}&{{}\leq\psi_{\sigma}\big(\mathsf{W}(\mathcal{R},\mathcal{F})\big)}\\ {}&{{}=\mathsf{e r f}(\frac{\sqrt{\bar{\alpha_{t}}}\operatorname{W\}(\mathcal{R},\mathcal{F})}{2\sqrt{2(1-\bar{\alpha_{t}})}}).}\\ \end{aligned}

\ {mathcal F__{{\mathcalmathcal N N}}^{t}}

---

Published as a conference paper at ICLR 2024

We note that inequality 9 can be written for any arbitrary denoising function that receives noisy images of RN t and FN t as inputs, and outputs denoised images with acceptable image quality.

# C PROOF OF THEOREM 2

Statement. The performance of a (σ,α)-robust detector measured using its AUROC is upper bounded as follows:

1 ψσ(Wϕ(R, F)) 2 1 + 2α − 2α2 AUROC(D) ≤ ψσ(Wϕ(R, F)) − +, 1 − α 2 2(1 − α)

Proof. We quantify the dissimilarity between the distributions R and F using the Wasserstein metric defined with respect to a norm ∥·∥ in the latent space R l as follows:

Wϕ(R, F) = inf E(x1,x2)∼γ∥ϕ(x1) − ϕ(x2)∥ , (10) γ∈Γ(R,F)

where Γ(R, F) is the set of all joint probability distributions of R and F, i.e., Z Γ(R, F) = γ : R d × R d → R≥0γ(x1,x2)dx2 = pdfR(x1) Rd Z and γ(x1,x2)dx1 = pdfF(x2), Rd

where pdfRand pdfFrepresent the probability density functions of R and F. For the sake of simplicity, we assume that there exists an element γ ∗ ∈ Γ that achieves the infimum. Otherwise, one can derive our results for some γ ∗ that achieves an expected distance of Wϕ(R, F) + δ for an arbitrarily small δ > 0.

We use the notation ψσ(·) to represent a concave upper bound on the total variation between two noise distributions, specifically N (ϕ(x1),σ) and N (ϕ(x2),σ). This upper bound is expressed as a function of the distance ∥ϕ(x1) − ϕ(x2)∥ between the respective images in the latent space, i.e.,

TV N (ϕ(x1),σ), N (ϕ(x2),σ) ≤ ψσ∥ϕ(x1) − ϕ(x2)∥ . (11)

In the case where N is an isometric Gaussian and the distance is measured using the ℓ2-norm, this bound takes the form of the Gauss error function, more precisely:

∥ϕ(x1) − ϕ(x2)∥2 ψσ∥ϕ(x1) − ϕ(x2)∥2= erf √. 2 2σ

Now, consider the distribution of noisy real images in the latent space under the noise distribution

N. Let R ϕ Nbe the distribution of latent representations ϕ˜ ∼N (ϕ(x),σ) where x ∼R. Similarly, define FN ϕ . The following lemma relates the performance of a (σ,α)-robust detector D under the original and noisy versions of the two distributions. Lemma 2. The AUROC of a (σ,α)-robust detector D on the original distributions R and F is bounded by that for the noisy versions of the distributions R
ϕ Nand FN ϕ as follows:

AUROCN(D) AUROC(D) ≤ + α. 1 − α

## Proof is available in Appendix D.

Next, we bound the total variation between the noisy distributions R ϕ Nand FN ϕ in terms of the Wasserstein distance between the original distributions R and F. The reason why this bound holds is that as R and F get closer to each other in the latent space, R ϕ Nand FN ϕ start to overlap due to the noise distribution N around them.

---

Published as a conference paper at ICLR 2024

Lemma 3. The total variation between the noisy distributions R ϕ Nand FN ϕ is bounded by the Wasserstein distance of the original distributions R and F as follows:

TV(R ϕ N, FN ϕ ) ≤ ψσWϕ(R, F) .

## Proof is available in Appendix E.

Now, we use the above two lemmas to put a bound on the performance of the detector on R and F. We first show that the performance on the noisy distributions R ϕ Nand FN ϕ is bounded by the total variation between these distributions. We then use Lemma 3 to convert this total variation distance to the Wasserstein distance between the original distributions R and F. Finally, we relate the bound to the detector’s performance on the original distributions using Lemma 2.

The true positive rate TPRNand the false positive rate FPRNof the detector on the noisy distribu- tions R ϕ Nand FN ϕ can be bounded by the total variation between these distributions as follows:

|TPRN− FPRN| = |P x∼F,ϕ˜∼N (ϕ(x),σ) [D(ϕ˜) = 1] − P x∼R,ϕ˜∼N (ϕ(x),σ) [D(ϕ˜) = 1]|

= TV(R ϕ N, FN ϕ )

Since the true positive rate is also bounded by one, we have:

TPRN≤ min(FPRN+ TV(R ϕ N, FN ϕ

), 1).
Denoting FPRN, TPRNand TV(R ϕ N, FN ϕ ) with x,y, and tv, respectively, for brevity, we bound the AUROCNas follows: Z1Z1 AUROCN(D) = ydx ≤ min(x + tv, 1)dx 0 0 Z1−tvZ1 = (x + tv)dx + dx 0 1−tv 2 1−tv x1 = + tvx + |x|1−tv 2 0 (1 − tv) 2 = + tv(1 − tv) + tv 2 1 tv22 = + − tv + tv − tv + tv 2 2 1 tv2 = + tv −. 2 2 Thus,

1ϕ ϕTV(R ϕ N, FN ϕ ) 2 AUROCN(D) = + TV(RN, FN) − 2 2 2 1 ψσWϕ(R, F) ≤ + ψσWϕ(R, F) −. 2 2 (from Lemma 3 and since 1/2 + x − x2/2 is increasing in [0, 1])

## Finally, from Lemma 2, we have:

AUROCN(D) AUROC(D) ≤ + α 1 − α 2 ! 1 1 ψσWϕ(R, F) ≤ + ψσWϕ(R, F) − + α (from above) 1 − α 2 2

ψσ(W(R, F)) 1 + 2α − 2α2 = ψσ(W(R, F)) − +. 1 − α 2(1 − α)

---

D PROOF OF LEMMA 2

Statement. The AUROC of a (σ,α)-robust detector D on the original distributions R and F is
ϕ ϕ
bounded by that for the noisy versions of the distributions RNand FNas follows:

(\sigma,\alpha)

\mathcal{R}

\mathcal{F}

\mathcal{R}_{N}^{\phi}

\mathcal{F}_{N}^{\phi}

\mathsf{A U R O C}(D)\leq\frac{\mathsf{A U R O C}_{\mathcal{N}}(D)}{1-\alpha}+\alpha.

Proof. Let TPR, FPR, TPRNand FPRNdenote the true and false positive rates of the detector on
the original and noisy distributions, respectively, assuming the fake distribution as the positive class.
Then, by definition,
Z1

\mathsf{T P R}_{\mathcal{N}}

\mathsf{F P R}_{N}

\mathsf{A U R O C}_{\mathcal{N}}(D)=\int_{0}^{1}\mathsf{T P R}_{\mathcal{N}}\;mathrm{}{d}\mathsf{F P R}_{\mathcal{N}}.

Now, to relate this to AUROC, we lower bound TPRNand upper bound FPRNin terms of TPR
and FPR.

\mathsf{T P R}_{\mathcal{N}}

\mathsf{F P R}_{N}

\begin{aligned}{\mathsf{T P R}_{\mathcal{N}}}&{{}=\mathbb{P}_{x\sim\mathcal{F},\tilde{\phi}\sim\mathcal{N}(\phi(x),\sigma)}[D(\tilde{\phi})=1]}\\ {}&{{}=\mathbb{P}_{x\sim\mathcal{F},\tilde{\phi}\sim\mathcal{N}(\phi(x),\sigma)}[D(\tilde{\phi})=1|D(\phi(x))=1]\mathbb{P}_{x\sim\mathcal{F}}[D(\phi(x))=1]}\\ {}&{{}+\mathbb{P}_{x\sim\mathcal{F},\tilde{\phi}\sim\mathcal{N}(\phi(x),\sigma)}[D(\tilde{\phi})=1|D(\phi(x))=0]\mathbb{P}_{x\sim\mathcal{F}}[D(\phi(x))=0]}\\ {}&{{}\geq(1-\alpha)\mathbb{P}_{x\sim\mathcal{F}}[D(\phi(x))=1]}&{

(law of total probability)
(from Equation 3)

(from Equation 3)

\begin{aligned}{\mathsf{A I R O C C}_{\mathcal{N}}(D)}&{{}=\int_{0}^{1}\mathsf{T P R}_{\mathcal{N}}\ d\mathsf{F P R}_{\mathcal{N}}}\\ {}&{{}\geq\int_{0}^{1}(1-\alpha)\mathsf{T P R}\ d\mathsf{F P R}_{\mathcal{N}}}\\ {}&{{}=(1-\alpha)\int_{0}^{1}\mathsf{T P R}\ d{\mathsf{F P R R}__{\mathcal{N}}}}{{\ \\ \\\ \\\ \\\ \\\ \\\ \\\ \\\ \\\ \\\ \\\ \\\ \\\ \\\ \\\ \\\ (\\mathsf{{T R R}_{\mathcal{N}}}\geq(1-\alpha)\mathsf{T P R R})}}\\ {}&{{}\geq(1-\alpha)\int_{0}^{1-\alpha}\mathsf{T P R R}\ d\mathsf{F F R R}}}\\ {{{}}{}}{}}{&}{\{\ geq11-(\alphaalpha)\mathsf{T P R R}\ {mathsf{d F R R}}}}\\ {}&{{}{\ }\geq(1-\alpha)\mathsf((\ mathsf{T P R}{\mathsf{\ R}}{\ d\})}}\\ \end{aligned}

---

Published as a conference paper at ICLR 2024

1.0 1.0
0.8 0.8
0.6 0.6 AUROC
0.4 AUROC0.4 sigma = 1.0 sigma = 2.0
0.2 sigma = 3.00.2 Random detector sigma = 4.0 DeepFakes random detector FaceSwap
0.0 0 0.0 2 4 6 8 10 0.0 2.5 5.0 7.5 10.0 12.5 15.0 17.5 20.0 Wasserstein Distance *σ* a t *α* = 1 %
Figure 16: Deepfake detection performance Figure 17: AUROC vs. σ plot for a (σ,α =

bound w.r.t Wasserstein distance between real 0.01)-robust deep fake detector with a VGG- R and fake F distributions for different values 16-BN backbone on DeepFakes (deepfakes) and of σ. A more robust detector (higher σ) has a FaceSwap (MarekKowalski) datasets. Consis- lower performance. tent with Theorem 2, AUROC drops as the ro- bustness of the detector increases.

# E PROOF OF LEMMA 3

Statement. The total variation between the noisy distributions R ϕ Nand FN ϕ is bounded by the Wasserstein distance of the original distributions R and F as follows:

TV(R ϕ N, FN ϕ ) ≤ ψσWϕ(R, F) .

Proof. By definition of total variation, we have:

TV(R ϕ N, FN ϕ ) = sup P ϕ ˜ 1 ∼R ϕ [ϕ˜1∈ E] − P ϕ ˜ 2 ∼F ϕ [ϕ˜2∈ E] EN N = sup P x 1 ∼R,ϕ˜1∼N (ϕ(x1),σ) [ϕ˜1∈ E] E − P x 2 ∼F,ϕ˜2∼N (ϕ(x2),σ) [ϕ˜2∈ E] (definition of R ϕ Nand FN ϕ )

= sup P (x1,x2)∼γ∗,ϕ˜1∼N (ϕ(x1),σ) [ϕ˜1∈ E] E − P (x1,x2)∼γ∗,ϕ˜2∼N (ϕ(x2),σ) [ϕ˜2∈ E] (since γ ∗ has marginals R and F) h i = sup E(x1,x2)∼γ∗ P ϕ ˜ 1 ∼N (ϕ(x1),σ) [ϕ˜1∈ E] − P ϕ ˜ 2 ∼N (ϕ(x2),σ) [ϕ˜2∈ E] E

≤ sup E(x1,x2)∼γ∗ P ϕ ˜ 1 ∼N (ϕ(x1),σ) [ϕ˜1∈ E] − P ϕ ˜ 2 ∼N (ϕ(x2),σ) [ϕ˜2∈ E] E (since |a + b|≤|a| + |b|)

≤ E(x1,x2)∼γ∗ TV N (ϕ(x1),σ), N (ϕ(x2),σ) (by definition of total variation)

≤ E(x1,x2)∼γ∗ ψσ∥ϕ(x1) − ϕ(x2)∥ (from Equation 11)

≤ ψσE(x1,x2)∼γ∗ [∥ϕ(x1) − ϕ(x2)∥] (since ψσis concave and Jensen’s inequality)

= ψσWϕ(R, F) . (from definition of γ ∗ and Equation 10)

---

Published as a conference paper at ICLR 2024 % %

*α α*

at

20.0
at

20.0
17.5 17.5 *σ σ*
15.0 15.0 e e c12.5 c12.5 en
10.0
en

10.0
r

7.5
r

7.5
e e f5.0f5.0 n I n I

2.5 DeepFakes 2.5 DeepFakes FaceSwap FaceSwap
0.0 0.0
0.0 2.5 5.0 7.5 10.0 12.5 15.0 17.5 20.0 0.0 2.5 5.0 7.5 10.0 12.5 15.0 17.5 20.0
T r a i n i n g *σ* T r a i n i n g *σ*

(a) ResNet-18 (b) VGG-16-BN
Figure 18: Detector robustness (inference σ at α = 1%) to random noise in the ϕ latent space

increases as the standard deviation of noise used for training increases. Various robust detectors are trained by adding Gaussian noise of standard deviation between 0 and 20 to the ϕ latent space. Y-axes represent the standard deviation of the noise at inference time on the test dataset for which the detector achieves α = 0.01 as per Equation 3.

# F MORE DETAILS ON DEEPFAKE DETECTOR EXPERIMENTS

Theorem 2 provides a robustness-reliability trade-off for deepfake detectors. Figure 8 shows how the AUROC reduces with robustness for different Wasserstein distances based on our bound. Fig- ure 16 shows how the AUROC reduces with Wasserstein distance for various noise values σ. We perform experiments on the FaceForensics++ dataset hosted by Rossler et al. (2019) to empirically ¨ verify our theoretical insights. FaceForensics++ (Rossler et al., 2019) is a forensic dataset that con-¨ sists of 1000 video sequences that are manipulated using different automated face manipulation techniques1.For our experiments, we use frames from videos that are manipulated using FaceSwap (MarekKowalski) and Deepfakes (deepfakes). FaceSwap manipulations are based on classical com- puter graphics-based methods, while DeepFakes relies on a learning-based approach. We perform a set of preprocessing steps to extract aligned 228 × 228 face images from the videos using the Deep- Fakes software2. We randomly sample 5 frames from each video. We ensure that our final image datasets have no overlap of identities between the training and test splits. After preprocessing, our FaceSwap image dataset contains 4316 (1059, respectively) original and 3529 (1857, respectively) manipulated images in the training (test, respectively) dataset. Similarly, our DeepFakes image dataset contains 4316 (1059, respectively) original and 3522 (1843, respectively) manipulated im- ages in the training (test, respectively) dataset.

We train different detectors with the standard deviation of noise σ varied from 0 to 20 with the following objective

N 1 X min ℓ(D(ϕ(xi) + ni),yi) θ N i=1

where ℓ is the cross-entropy loss, ni∼N (0,σ2I), and θ represent the parameters that defines D. For different detectors, we compute the inference σ on the test dataset at which they achieve an α of 0.01 using Equation 3. Figure 18 shows that the detector robustness (inference σ at α = 1%) to random noise increases as the training sigma increases. We use ten randomly sampled Gaussian noises for each sample ϕ(x) for this evaluation. Figures 9 and 17 plots the empirical trade-off between AUROC and robustness (σ at α = 1%) for detectors with ResNet-18 and VGG-16-BN backbones, respectively, on the DeepFakes and FaceSwap datasets.

[https://github.com/ondyari/FaceForensics/](https://github.com/ondyari/FaceForensics/) [https://github.com/deepfakes/faceswap](https://github.com/deepfakes/faceswap)

---

Published as a conference paper at ICLR 2024

Figure 19: We use ResNet-18 and the FaceSwap dataset to visualize images that correspond to

noisy latent space features. We optimize Equation 12 to find additive noises in the image space that cause large ℓ2 perturbations in the latent space ϕ. In top row, we show the original images from the FaceSwap dataset. The rest of the rows show noisy images that produce perturbations corresponding ϵ in the latent space. Here, we show that small additive noises in the image space can lead to large perturbations in the ϕ space.

We also visualize how the noisy latent space vectors would look in the image space (see Figure 19). We optimize the following objective to find such images: 2 min ϵ −∥ϕ(x) − ϕ(x + δ)∥2(12) δ

In the above optimization problem, we find an additive noise δ when added to a clean image x leads to an ℓ2 perturbation of ϵ in the latent space. As shown in Figure 19, FaceSwap images with small perturbations in the input space can cause large perturbations in the latent space ϕ of ResNet-18.
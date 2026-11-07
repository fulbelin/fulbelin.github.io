---
layout: fbk-page
title: "Curriculum Vitae"
label: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

Saarbrücken, Germany · [fulbelin.korukoglu@gmail.com](mailto:fulbelin.korukoglu@gmail.com) · [LinkedIn](https://www.linkedin.com/in/belin-korukoglu) · [GitHub](https://github.com/fulbelin) · [Google Scholar](https://scholar.google.com/citations?user=Hdj-VHIAAAAJ&hl=en)

## Education

**Saarland University** — *M.Sc. Bioinformatics* · Oct. 2024 – Jan. 2027 · Grade: 2.3 / Gut

Coursework: Machine Learning, Neural Networks, Data Networks, Biological Data Processing, C++ Programming

## Work Experience

**Research Assistant** — *I2SC, Saarland University*, Saarbrücken, Germany · May 2025 – Present

- Built a geospatial data platform using **Python, FastAPI, PostgreSQL/PostGIS, GeoPandas, and Redis/Celery**, supporting analyses over **300K places of interest across 50+ regions**.
- Reduced per-record processing time by **35%** by profiling pipeline performance, modeling the primary bottleneck (R² = 0.92), and optimizing request pacing and concurrency.
- Designed asynchronous processing and caching workflows for long-running geospatial jobs, improving scalability and reducing repeated computation across analysis runs.

**Full-Stack Data Scientist** — *Bozkurt Lab, Emory University*, Remote · Jun. 2024 – Oct. 2024

- Built and deployed a full-stack healthcare AI governance platform using **TypeScript, Next.js, Prisma, and PostgreSQL**, with database-backed search, filtering, comparison, and relational analysis.
- Processed **3,800+ regulatory and policy documents** into a structured dataset of **140 validated sources**, supporting analysis published in a **first-author peer-reviewed paper**.
- Designed the relational schema and query layer for cross-region policy analysis, translating heterogeneous regulatory requirements into structured, searchable data.

**Undergraduate Research Assistant** — *Mangul Lab, University of Southern California*, Remote · Aug. 2023 – Apr. 2024

- Benchmarked classical and deep-learning models for mortality prediction across **16 independent transcriptomic cohorts** with **1,000+ patients**, achieving **AUC > 0.85** with ensemble models while evaluating cross-cohort generalization.
- Applied **SHAP, permutation importance, and drop-column analysis** to identify reproducible predictive features and separate biological signal from cohort-specific batch effects.

**Undergraduate Research Assistant** — *BRAIN Lab, Harvard Medical School*, Remote · Jun. 2023 – Oct. 2023

- Implemented and evaluated a **TensorFlow MRI reconstruction pipeline** across multiple public brain-imaging datasets and undersampling settings, automating model inference and reconstruction-quality evaluation.

## Projects

**Topology-Aware Graph-MIL for Computational Pathology** · Nov. 2025 – Present

- Built an end-to-end **graph-based deep learning pipeline** for whole-slide image classification, processing **109 gigapixel slides and 3.9M+ image patches** with foundation-model embeddings and **PyTorch Geometric**.
- Benchmarked graph and attention-based architectures using **5-fold site-blocked cross-validation**, multi-seed experiments, and corrected statistical testing to evaluate robustness under distribution shift.
- Engineered a reproducible **terabyte-scale ML pipeline** for image tiling, GPU-based feature extraction, graph construction, caching, and distributed HPC experimentation.

**[Saarbrücken Geospatial Analytics Platform](https://github.com/fulbelin/is2c)**

- Built an interactive geospatial analytics platform with **database-backed querying, PostGIS spatial indexing, cached routing, and SQL-driven visualizations** for large-scale venue data.

**[Scalable DNA-Seq Pipeline](https://github.com/fulbelin/Snakemake-workflow-dna-seq-short-read-blend-map)**

- Built a modular **Snakemake workflow** automating preprocessing and BLEND-based read alignment with dependency tracking, reproducible execution, and parallelizable pipeline stages.

## Skills

**Languages:** Python, SQL, C++, R, Bash

**Machine Learning:** PyTorch, PyTorch Geometric, TensorFlow, scikit-learn, pandas, NumPy, SHAP, Weights & Biases

**Backend, Data & Infrastructure:** FastAPI, PostgreSQL/PostGIS, DuckDB, Redis, Celery, Docker, SLURM/GPU clusters, GCP

## Selected Publications

- **Korukoglu, F. B.** et al. "Mapping ethical guidelines for AI in healthcare: A global perspective." *Studies in Health Technology and Informatics*, 2025. [PubMed](https://pubmed.ncbi.nlm.nih.gov/40380727/)
- Icer Baykal, P. et al., **Korukoglu, F. B.** "Assessing genomic reproducibility of read alignment tools." *bioRxiv*, 2025. [Preprint](https://www.biorxiv.org/content/10.1101/2025.05.08.652934v1)
- Chhugani, K. et al., **Korukoglu, F. B.** "Benchmarking machine learning algorithms for sepsis mortality prediction." *RECOMB-seq*, 2024. Poster

"""Design competitions crawlers package."""

from base import Article, BaseCrawler, SourceType

__all__ = [
    "Article",
    "BaseCrawler",
    "SourceType",
    # International Awards
    "ADesignAwardCrawler",
    "RedDotCrawler",
    "IfDesignCrawler",
    "DAndADCrawler",
    "IdeoCrawler",
    "Core77Crawler",
    "DezeenAwardsCrawler",
    "FrameAwardsCrawler",
    "ArchitizerCrawler",
    "MuseDesignCrawler",
    "SparkAwardsCrawler",
    "IndigoDesignCrawler",
    "GermanDesignCrawler",
    "LondonDesignCrawler",
    "DnaParisCrawler",
    # Student/Youth Awards
    "RedDotJuniorCrawler",
    "IfStudentCrawler",
    "JamesDysonCrawler",
    "BraunPrizeCrawler",
    "LexusDesignCrawler",
    "SonyDesignCrawler",
    "SamsungDesignCrawler",
    "AdobeAACCrawler",
    "YoungOnesCrawler",
    "AdcCrawler",
    # Creative/Visual Awards
    "GraphisCrawler",
    "CommartsAwardsCrawler",
    "TokyoTdcCrawler",
    "NyTdcCrawler",
    "LaTdcCrawler",
    "BrandNewCrawler",
    "PentawardsCrawler",
    "DielineCrawler",
    "TransformAwardsCrawler",
    "CreativeCommCrawler",
    # Furniture/Industrial Design
    "SitFurnitureCrawler",
    "ElectroluxCrawler",
    "SwarovskiCrawler",
    "HmDesignCrawler",
    "MichelinDesignCrawler",
    "HuaweiDesignCrawler",
    "WorldDesignCrawler",
    "InternationalDesignCrawler",
    # Chinese Competitions
    "FounderTypeCrawler",
]

from .a_design_award import ADesignAwardCrawler
from .red_dot import RedDotCrawler
from .if_design import IfDesignCrawler
from .d_and_ad import DAndADCrawler
from .ideo import IdeoCrawler
from .core77 import Core77Crawler
from .dezeen_awards import DezeenAwardsCrawler
from .frame_awards import FrameAwardsCrawler
from .architizer import ArchitizerCrawler
from .muse_design import MuseDesignCrawler
from .spark_awards import SparkAwardsCrawler
from .indigo_design import IndigoDesignCrawler
from .german_design import GermanDesignCrawler
from .london_design import LondonDesignCrawler
from .dna_paris import DnaParisCrawler
from .red_dot_junior import RedDotJuniorCrawler
from .if_student import IfStudentCrawler
from .james_dyson import JamesDysonCrawler
from .braun_prize import BraunPrizeCrawler
from .lexus_design import LexusDesignCrawler
from .sony_design import SonyDesignCrawler
from .samsung_design import SamsungDesignCrawler
from .adobe_aac import AdobeAACCrawler
from .young_ones import YoungOnesCrawler
from .adc import AdcCrawler
from .graphis import GraphisCrawler
from .commarts_awards import CommartsAwardsCrawler
from .tokyo_tdc import TokyoTdcCrawler
from .ny_tdc import NyTdcCrawler
from .la_tdc import LaTdcCrawler
from .brand_new import BrandNewCrawler
from .pentawards import PentawardsCrawler
from .dieline import DielineCrawler
from .transform_awards import TransformAwardsCrawler
from .creative_comm import CreativeCommCrawler
from .sit_furniture import SitFurnitureCrawler
from .electrolux import ElectroluxCrawler
from .swarovski import SwarovskiCrawler
from .hm_design import HmDesignCrawler
from .michelin_design import MichelinDesignCrawler
from .huawei_design import HuaweiDesignCrawler
from .world_design import WorldDesignCrawler
from .international_design import InternationalDesignCrawler
from .founder_type import FounderTypeCrawler

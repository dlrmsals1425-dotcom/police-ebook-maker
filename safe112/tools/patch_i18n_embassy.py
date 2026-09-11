# -*- coding: utf-8 -*-
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "i18n"

PATCH = {
    "ko": {
        "home": {
            "embassyTitle": "대사관·영사 도움",
            "embassyDesc": "위험하면 먼저 112. 여권·구금은 자국 공관"
        },
        "check": {"stopTitle": "일단 멈추세요"},
        "show": {"phrases": {"embassy": "제 나라 대사관에 연락하고 싶습니다."}},
        "embassy": {
            "title": "대사관·영사관에 도움 요청",
            "lead": "한국에서 범죄가 발생 중이면 대사관보다 112가 먼저입니다. 공관은 여권, 구금 통지, 가족 연락, 변호사 안내를 도울 수 있습니다.",
            "first112": "지금 위험하거나 피해를 당했다면 112에 신고하세요. 대사관이 한국 경찰을 대신하지 않습니다.",
            "can": "공관이 도울 수 있는 일",
            "cannot": "공관이 대신할 수 없는 일",
            "canItems": [
                "여권 분실·손상 시 여행증명서나 재발급 안내",
                "체포·구금됐을 때 가족에게 알리고 면회를 돕는 일",
                "현지 변호사·통역 정보를 알려 주는 일",
                "병원·경찰서에 어떻게 가는지 안내"
            ],
            "cannotItems": [
                "한국 경찰 수사나 재판을 멈추게 할 수 없습니다",
                "벌금을 내 주거나 보석금을 내 주지 않습니다",
                "호텔·생활비를 대신 내 주지 않는 경우가 많습니다",
                "위급 출동은 112·119입니다"
            ],
            "website": "공식 누리집 열기",
            "findOthers": "다른 나라 공관은 외교부 누리집에서 찾을 수 있습니다.",
            "hours": {
                "24h": "24시간",
                "weekday": "평일 근무시간",
                "after-hours": "근무시간 이후(본국 외교부)"
            },
            "missions": {
                "cn": {
                    "name": "주한 중국대사관 / 12308 영사보호",
                    "help": "중국 국적 유학생. 한국에서는 +86-10-12308로 외교부 영사보호 핫라인에 연락할 수 있습니다.",
                    "warn": "12308이 먼저 걸어와 송금·안전계좌를 요구하면 사기입니다. 끊고 직접 번호를 눌러 확인하세요. 한국에서 위험하면 112.",
                    "phones": {
                        "12308": "중국 외교부 영사보호 핫라인",
                        "12308b": "12308 예비번호"
                    }
                },
                "th": {
                    "name": "주한 태국대사관",
                    "help": "태국 국적 유학생. 여권·영사 보호는 한남동 공관으로 연락하세요.",
                    "phones": {
                        "main": "대사관 대표전화",
                        "consular": "영사부"
                    }
                },
                "vn": {
                    "name": "주한 베트남대사관",
                    "help": "베트남 국적 유학생. 대표전화로 영사 보호를 요청하세요.",
                    "phones": {
                        "main": "대사관 대표전화"
                    }
                },
                "my": {
                    "name": "주한 말레이시아대사관",
                    "help": "말레이시아 국적 유학생. 서울 공관과 쿠알라룸푸르 외교부 당직 전화가 있습니다.",
                    "phones": {
                        "main": "서울 대사관",
                        "hq": "말레이시아 외교부 헬프라인",
                        "duty": "외교부 근무시간 이후 당직"
                    }
                },
                "us": {
                    "name": "주한 미국대사관",
                    "help": "미국 시민. 영어 긴급 영사 지원은 아래 번호입니다. 다른 영어권 국적은 자국 공관 누리집을 확인하세요.",
                    "phones": {
                        "emergency": "미국 시민 긴급 지원"
                    }
                }
            }
        }
    },
    "en": {
        "home": {
            "embassyTitle": "Embassy / consular help",
            "embassyDesc": "Call 112 first in danger. Your embassy helps with passports and detention"
        },
        "check": {"stopTitle": "Stop now"},
        "show": {"phrases": {"embassy": "I want to contact my embassy."}},
        "embassy": {
            "title": "Ask your embassy for help",
            "lead": "If a crime is happening in Korea, call 112 before the embassy. Missions can help with passports, detention, family contact, and lawyer information.",
            "first112": "If you are in danger or a crime happened, call 112. An embassy does not replace Korean police.",
            "can": "What your mission can often do",
            "cannot": "What they usually cannot do",
            "canItems": [
                "Help replace a lost or damaged passport",
                "Notify family and visit if you are arrested",
                "Share information about local lawyers and interpreters",
                "Explain how to reach a hospital or police station"
            ],
            "cannotItems": [
                "They cannot stop a Korean police investigation or trial",
                "They do not pay fines or bail for you",
                "They often cannot pay hotel or living costs",
                "Emergency dispatch is 112 and 119"
            ],
            "website": "Open official website",
            "findOthers": "Find other missions on the Korean Ministry of Foreign Affairs site.",
            "hours": {
                "24h": "24 hours",
                "weekday": "Weekday office hours",
                "after-hours": "After hours (home MFA)"
            },
            "missions": {
                "cn": {
                    "name": "Chinese Embassy / 12308 consular protection",
                    "help": "For Chinese nationals. From Korea you can call China’s 24-hour consular hotline +86-10-12308.",
                    "warn": "If 12308 calls you first and asks for money or a “safe account,” it is a scam. Hang up and dial the number yourself. In danger in Korea, call 112.",
                    "phones": {
                        "12308": "China MFA consular protection hotline",
                        "12308b": "12308 backup number"
                    }
                },
                "th": {
                    "name": "Royal Thai Embassy in Seoul",
                    "help": "For Thai nationals. Call the Hannam-dong mission for passports and consular protection.",
                    "phones": {
                        "main": "Embassy switchboard",
                        "consular": "Consular section"
                    }
                },
                "vn": {
                    "name": "Embassy of Vietnam in Seoul",
                    "help": "For Vietnamese nationals. Call the main number and ask for consular protection.",
                    "phones": {
                        "main": "Embassy switchboard"
                    }
                },
                "my": {
                    "name": "Embassy of Malaysia in Seoul",
                    "help": "For Malaysian nationals. Seoul mission plus Malaysia MFA duty numbers.",
                    "phones": {
                        "main": "Embassy in Seoul",
                        "hq": "Malaysia MFA helpline",
                        "duty": "MFA after-hours duty officer"
                    }
                },
                "us": {
                    "name": "U.S. Embassy in Seoul",
                    "help": "For U.S. citizens. Other English-speaking nationals should use their own embassy website.",
                    "phones": {
                        "emergency": "U.S. citizen emergency help"
                    }
                }
            }
        }
    },
    "zh-CN": {
        "home": {
            "embassyTitle": "使馆 / 领事帮助",
            "embassyDesc": "有危险先打112。护照、被拘可找本国使馆"
        },
        "check": {"stopTitle": "先停下来"},
        "show": {"phrases": {"embassy": "我想联系本国大使馆。"}},
        "embassy": {
            "title": "向大使馆、领事馆求助",
            "lead": "在韩国正在发生犯罪时，先打112，再联系使馆。使馆可协助护照、被拘通知家属、律师信息。",
            "first112": "现在有危险或已经受害，请打112。使馆不能代替韩国警察。",
            "can": "使领馆通常可以帮的",
            "cannot": "通常帮不了的",
            "canItems": [
                "护照丢失或损坏时，协助旅行证或补发",
                "被拘留时通知家人、协助探视",
                "提供当地律师、翻译信息",
                "告知如何去医院或警察局"
            ],
            "cannotItems": [
                "不能让韩国警察停止调查或审判",
                "不会代交罚款或保释金",
                "一般不会代付酒店或生活费",
                "紧急出警是112、119"
            ],
            "website": "打开官方网站",
            "findOthers": "其他国家使馆可在韩国外交部网站查询。",
            "hours": {
                "24h": "24小时",
                "weekday": "工作日上班时间",
                "after-hours": "下班后（本国外交部）"
            },
            "missions": {
                "cn": {
                    "name": "中国驻韩国大使馆 / 12308领保",
                    "help": "中国公民可从韩国直拨外交部全球领事保护热线 +86-10-12308。",
                    "warn": "如果显示12308的电话主动打来并要你汇款或转到“安全账户”，那是诈骗。请挂断，自己拨打官方号码。在韩国遇险请打112。",
                    "phones": {
                        "12308": "中国外交部领事保护热线",
                        "12308b": "12308备用号码"
                    }
                },
                "th": {
                    "name": "泰国驻韩国大使馆",
                    "help": "泰国公民。护照和领事保护请联系汉南洞使馆。",
                    "phones": {
                        "main": "使馆总机",
                        "consular": "领事部"
                    }
                },
                "vn": {
                    "name": "越南驻韩国大使馆",
                    "help": "越南公民。请打总机要求领事保护。",
                    "phones": {
                        "main": "使馆总机"
                    }
                },
                "my": {
                    "name": "马来西亚驻韩国大使馆",
                    "help": "马来西亚公民。可联系首尔使馆或吉隆坡外交部值班电话。",
                    "phones": {
                        "main": "首尔大使馆",
                        "hq": "马来西亚外交部热线",
                        "duty": "外交部下班后值班"
                    }
                },
                "us": {
                    "name": "美国驻韩国大使馆",
                    "help": "美国公民紧急领事协助。其他英语国家请查本国使馆网站。",
                    "phones": {
                        "emergency": "美国公民紧急协助"
                    }
                }
            }
        }
    },
    "th": {
        "home": {
            "embassyTitle": "สถานทูต / กงสุล",
            "embassyDesc": "อันตรายให้โทร 112 ก่อน หนังสือเดินทางและถูกควบคุมตัวให้ติดต่อสถานทูต"
        },
        "check": {"stopTitle": "หยุดก่อน"},
        "show": {"phrases": {"embassy": "ฉันต้องการติดต่อสถานทูตของฉัน"}},
        "embassy": {
            "title": "ขอความช่วยเหลือจากสถานทูต",
            "lead": "ถ้าอาชญากรรมกำลังเกิดในเกาหลี ให้โทร 112 ก่อนสถานทูต สถานทูตช่วยเรื่องหนังสือเดินทาง การถูกควบคุมตัว การติดต่อครอบครัว และข้อมูลทนายความได้",
            "first112": "ถ้าอันตรายหรือเป็นผู้เสียหาย ให้โทร 112 สถานทูตไม่ได้แทนตำรวจเกาหลี",
            "can": "สิ่งที่สถานทูตมักช่วยได้",
            "cannot": "สิ่งที่มักช่วยไม่ได้",
            "canItems": [
                "ช่วยเรื่องหนังสือเดินทางหายหรือชำรุด",
                "แจ้งครอบครัวและเยี่ยมหากถูกจับกุม",
                "ให้ข้อมูลทนายความและล่ามในท้องถิ่น",
                "บอกทางไปโรงพยาบาลหรือสถานีตำรวจ"
            ],
            "cannotItems": [
                "หยุดการสอบสวนหรือการพิจารณาคดีของตำรวจเกาหลีไม่ได้",
                "ไม่จ่ายค่าปรับหรือประกันตัวให้",
                "มักไม่จ่ายค่าโรงแรมหรือค่าครองชีพ",
                "การออกเหตุฉุกเฉินคือ 112 และ 119"
            ],
            "website": "เปิดเว็บไซต์ทางการ",
            "findOthers": "สถานทูตประเทศอื่นดูได้ที่เว็บกระทรวงการต่างประเทศเกาหลี",
            "hours": {
                "24h": "24 ชั่วโมง",
                "weekday": "วันทำการ",
                "after-hours": "นอกเวลา (กระทรวงฯ ของประเทศตนเอง)"
            },
            "missions": {
                "cn": {
                    "name": "สถานทูตจีน / สายด่วน 12308",
                    "help": "สำหรับคนจีน โทรสายด่วนคุ้มครองกงสุล +86-10-12308 ได้จากเกาหลี",
                    "warn": "ถ้า 12308 โทรเข้ามาเองแล้วให้โอนเงิน ถือเป็นแก๊งหลอก วางสายแล้วกดหมายเลขเอง ถ้าอันตรายในเกาหลีโทร 112",
                    "phones": {
                        "12308": "สายด่วนคุ้มครองกงสุลจีน",
                        "12308b": "หมายเลขสำรอง 12308"
                    }
                },
                "th": {
                    "name": "สถานเอกอัครราชทูตไทย ณ กรุงโซล",
                    "help": "สำหรับคนไทย ติดต่อสถานทูตที่ฮันนัมดงเรื่องหนังสือเดินทางและการคุ้มครอง",
                    "phones": {
                        "main": "เบอร์ตัวแทนสถานทูต",
                        "consular": "ฝ่ายกงสุล"
                    }
                },
                "vn": {
                    "name": "สถานทูตเวียดนามประจำเกาหลี",
                    "help": "สำหรับคนเวียดนาม โทรเบอร์หลักแล้วขอด้านคุ้มครองคนไทยในต่างประเทศ",
                    "phones": {
                        "main": "เบอร์ตัวแทนสถานทูต"
                    }
                },
                "my": {
                    "name": "สถานทูตมาเลเซียประจำเกาหลี",
                    "help": "สำหรับคนมาเลเซีย สถานทูตโซลและสายกระทรวงการต่างประเทศมาเลเซีย",
                    "phones": {
                        "main": "สถานทูตที่โซล",
                        "hq": "สายด่วนกระทรวงฯ มาเลเซีย",
                        "duty": "เจ้าหน้าที่นอกเวลาของกระทรวงฯ"
                    }
                },
                "us": {
                    "name": "สถานทูตสหรัฐฯ ประจำเกาหลี",
                    "help": "สำหรับพลเมืองสหรัฐฯ ประเทศที่ใช้ภาษาอังกฤษอื่นให้ดูเว็บสถานทูตของตนเอง",
                    "phones": {
                        "emergency": "ช่วยเหลือฉุกเฉินพลเมืองสหรัฐฯ"
                    }
                }
            }
        }
    },
    "ms": {
        "home": {
            "embassyTitle": "Kedutaan / konsular",
            "embassyDesc": "Bahaya, telefon 112 dulu. Pasport dan tahanan: kedutaan anda"
        },
        "check": {"stopTitle": "Berhenti sekarang"},
        "show": {"phrases": {"embassy": "Saya mahu hubungi kedutaan saya."}},
        "embassy": {
            "title": "Minta bantuan kedutaan",
            "lead": "Jika jenayah sedang berlaku di Korea, telefon 112 sebelum kedutaan. Misi boleh bantu pasport, tahanan, keluarga, dan maklumat peguam.",
            "first112": "Jika bahaya atau jenayah berlaku, telefon 112. Kedutaan tidak menggantikan polis Korea.",
            "can": "Apa yang biasanya boleh dibantu",
            "cannot": "Apa yang biasanya tidak boleh",
            "canItems": [
                "Bantu ganti pasport hilang atau rosak",
                "Beritahu keluarga dan lawat jika anda ditahan",
                "Kongsi maklumat peguam dan jurubahasa tempatan",
                "Terangkan cara ke hospital atau balai polis"
            ],
            "cannotItems": [
                "Tidak boleh hentikan siasatan atau perbicaraan polis Korea",
                "Tidak membayar denda atau jaminan untuk anda",
                "Selalunya tidak membayar hotel atau kos hidup",
                "Penghantaran kecemasan ialah 112 dan 119"
            ],
            "website": "Buka laman rasmi",
            "findOthers": "Cari misi negara lain di laman Kementerian Luar Korea.",
            "hours": {
                "24h": "24 jam",
                "weekday": "Waktu pejabat hari bekerja",
                "after-hours": "Selepas waktu pejabat (MFA negara sendiri)"
            },
            "missions": {
                "cn": {
                    "name": "Kedutaan China / perlindungan konsular 12308",
                    "help": "Untuk warganegara China. Dari Korea boleh telefon talian 24 jam +86-10-12308.",
                    "warn": "Jika 12308 telefon anda dahulu dan minta wang, itu scam. Tutup telefon dan dail sendiri. Jika bahaya di Korea, telefon 112.",
                    "phones": {
                        "12308": "Talian perlindungan konsular MFA China",
                        "12308b": "Nombor sandaran 12308"
                    }
                },
                "th": {
                    "name": "Kedutaan Diraja Thai di Seoul",
                    "help": "Untuk warganegara Thai. Hubungi misi Hannam-dong untuk pasport dan perlindungan.",
                    "phones": {
                        "main": "Talian utama kedutaan",
                        "consular": "Bahagian konsular"
                    }
                },
                "vn": {
                    "name": "Kedutaan Vietnam di Seoul",
                    "help": "Untuk warganegara Vietnam. Telefon talian utama dan minta perlindungan konsular.",
                    "phones": {
                        "main": "Talian utama kedutaan"
                    }
                },
                "my": {
                    "name": "Kedutaan Malaysia di Seoul",
                    "help": "Untuk warganegara Malaysia. Misi Seoul dan talian MFA di Putrajaya.",
                    "phones": {
                        "main": "Kedutaan di Seoul",
                        "hq": "Talian bantuan MFA Malaysia",
                        "duty": "Pegawai bertugas selepas waktu pejabat"
                    }
                },
                "us": {
                    "name": "Kedutaan A.S. di Seoul",
                    "help": "Untuk warganegara A.S. Warganegara berbahasa Inggeris lain gunakan laman kedutaan sendiri.",
                    "phones": {
                        "emergency": "Bantuan kecemasan warganegara A.S."
                    }
                }
            }
        }
    },
    "vi": {
        "home": {
            "embassyTitle": "Đại sứ quán / lãnh sự",
            "embassyDesc": "Nguy hiểm thì gọi 112 trước. Hộ chiếu, bị tạm giữ: sứ quán nước mình"
        },
        "check": {"stopTitle": "Hãy dừng lại"},
        "show": {"phrases": {"embassy": "Tôi muốn liên hệ đại sứ quán của tôi."}},
        "embassy": {
            "title": "Nhờ đại sứ quán giúp",
            "lead": "Nếu tội phạm đang xảy ra tại Hàn Quốc, gọi 112 trước sứ quán. Cơ quan đại diện có thể giúp hộ chiếu, thông báo khi bị tạm giữ, liên hệ gia đình và thông tin luật sư.",
            "first112": "Nếu đang nguy hiểm hoặc đã bị hại, gọi 112. Đại sứ quán không thay cảnh sát Hàn Quốc.",
            "can": "Việc sứ quán thường giúp được",
            "cannot": "Việc thường không làm thay",
            "canItems": [
                "Hỗ trợ hộ chiếu mất hoặc hỏng",
                "Báo gia đình và thăm nếu bạn bị bắt",
                "Cung cấp thông tin luật sư, phiên dịch địa phương",
                "Hướng dẫn tới bệnh viện hoặc đồn cảnh sát"
            ],
            "cannotItems": [
                "Không thể dừng điều tra hay xét xử của cảnh sát Hàn Quốc",
                "Không nộp phạt hay tiền bảo lãnh thay bạn",
                "Thường không trả tiền khách sạn hay sinh hoạt phí",
                "Điều xe khẩn cấp là 112 và 119"
            ],
            "website": "Mở trang chính thức",
            "findOthers": "Tìm sứ quán nước khác trên trang Bộ Ngoại giao Hàn Quốc.",
            "hours": {
                "24h": "24 giờ",
                "weekday": "Giờ hành chính ngày thường",
                "after-hours": "Ngoài giờ (Bộ Ngoại giao nước mình)"
            },
            "missions": {
                "cn": {
                    "name": "Đại sứ quán Trung Quốc / đường dây 12308",
                    "help": "Công dân Trung Quốc có thể gọi đường dây bảo hộ lãnh sự 24 giờ +86-10-12308 từ Hàn Quốc.",
                    "warn": "Nếu 12308 gọi đến trước và đòi chuyển tiền thì đó là lừa đảo. Cúp máy và tự bấm số. Nguy hiểm tại Hàn Quốc thì gọi 112.",
                    "phones": {
                        "12308": "Đường dây bảo hộ lãnh sự Bộ Ngoại giao Trung Quốc",
                        "12308b": "Số dự phòng 12308"
                    }
                },
                "th": {
                    "name": "Đại sứ quán Thái Lan tại Seoul",
                    "help": "Công dân Thái. Liên hệ sứ quán Hannam-dong về hộ chiếu và bảo hộ.",
                    "phones": {
                        "main": "Tổng đài sứ quán",
                        "consular": "Phòng lãnh sự"
                    }
                },
                "vn": {
                    "name": "Đại sứ quán Việt Nam tại Hàn Quốc",
                    "help": "Công dân Việt Nam. Gọi số đại diện và yêu cầu bảo hộ công dân.",
                    "phones": {
                        "main": "Điện thoại đại diện sứ quán"
                    }
                },
                "my": {
                    "name": "Đại sứ quán Malaysia tại Seoul",
                    "help": "Công dân Malaysia. Sứ quán Seoul và đường dây Bộ Ngoại giao Malaysia.",
                    "phones": {
                        "main": "Sứ quán tại Seoul",
                        "hq": "Đường dây Bộ Ngoại giao Malaysia",
                        "duty": "Trực ngoài giờ của Bộ"
                    }
                },
                "us": {
                    "name": "Đại sứ quán Hoa Kỳ tại Seoul",
                    "help": "Công dân Hoa Kỳ. Quốc tịch nói tiếng Anh khác hãy xem trang sứ quán nước mình.",
                    "phones": {
                        "emergency": "Hỗ trợ khẩn cấp công dân Hoa Kỳ"
                    }
                }
            }
        }
    }
}


def deep_merge(a, b):
    for k, v in b.items():
        if k in a and isinstance(a[k], dict) and isinstance(v, dict):
            deep_merge(a[k], v)
        else:
            a[k] = v
    return a


def main():
    for lang, patch in PATCH.items():
        path = ROOT / f"{lang}.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        deep_merge(data, patch)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("patched", lang)


if __name__ == "__main__":
    main()

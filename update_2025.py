import pandas as pd
import json

def update_scores():
    t4_path = '/Users/enes/turkey-university-api/backend/data/tablo4_ykd25082025.xlsx'
    t3_path = '/Users/enes/turkey-university-api/backend/data/tablo3_ykd25082025.xlsx'
    json_path = 'backend/data/turkey-universities-enhanced.json'

    # header=2 diyerek başlıkların 2. satırda (Program Kodu'nun olduğu yer) olduğunu söylüyoruz
    df4 = pd.read_excel(t4_path, header=2)
    df3 = pd.read_excel(t3_path, header=2)
    all_data = pd.concat([df4, df3], ignore_index=True)

    # Sütun isimlerini temizleyelim
    all_data.columns = [str(c).strip() for c in all_data.columns]

    with open(json_path, 'r', encoding='utf-8') as f:
        universities = json.load(f)

    updated_count = 0
    
    # Senin çıktına göre gerçek başlık isimlerini buraya sabitliyoruz
    CODE_COL = 'Program Kodu'
    SCORE_COL = 'En Küçük Puan'

    print(f"Eşleştirme başlıyor... (Kullanılan sütunlar: {CODE_COL} ve {SCORE_COL})")

    for univ in universities:
        for faculty in univ.get('faculties', []):
            for program in faculty.get('programs', []):
                try:
                    # JSON'daki kodu al
                    p_code = int(program['yokData2025']['programCode'])
                    
                    # Excel'de bu kodu ara
                    match = all_data[all_data[CODE_COL] == p_code]
                    
                    if not match.empty:
                        raw_score = match.iloc[0][SCORE_COL]
                        
                        # Puanı temizleyelim (ÖSYM '--' koyabiliyor)
                        str_score = str(raw_score).replace(',', '.').strip()
                        if str_score and str_score != '--':
                            program['yokData2025']['quota']['general']['minScore'] = float(str_score)
                            updated_count += 1
                except Exception as e:
                    continue

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(universities, f, ensure_ascii=False, indent=2)

    print(f"BAŞARILI! Toplam {updated_count} program 2025 gerçek verileriyle güncellendi. 🚀")

if __name__ == "__main__":
    update_scores()

from graphviz import Digraph

# Süreç Akışı: Yeni Hasta Kaydı ve Test Süreci
bpmn = Digraph('Süreç_Akışı', format='png')
bpmn.attr(rankdir='LR', size='10,5')
bpmn.attr('node', shape='box')

# Süreç adımları
steps = [
    ("1", "Hasta Girişi (Kayıt Açılır)"),
    ("2", "Randevu Oluşturulur"),
    ("3", "Odyolog Test Uygular"),
    ("4", "Test Sonuçları Sisteme Girilir"),
    ("5", "Sistem Önerilen Cihazları Listeler"),
    ("6", "Cihaz Denemesi Yapılır"),
    ("7", "Cihaz Hareketi Kayıt Edilir"),
    ("8", "Satış Yapılır ve Fatura Kesilir")
]

# Adımları ekle
for step_id, label in steps:
    bpmn.node(step_id, label)

# Bağlantılar
for i in range(1, len(steps)):
    bpmn.edge(str(i), str(i + 1))

# Render diyagram
bpmn.render('/mnt/data/surec_akisi_hasta_test', format='png', cleanup=False)
'/mnt/data/surec_akisi_hasta_test.png'

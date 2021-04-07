var DataArray_1 = [`int i, j, key=0, temp=0;
void InsertSort(int *mas, int n) //сортировка вставками
{
for (i=0; i<n-1; i++)
{`, `key=i+1;
temp=mas[key];
for (j=i+1; j>0; j--)
{
if (temp<mas[j-1])
{`, `mas[j]=mas[j-1];
key=j-1;
}
}
mas[key]=temp;
}`, `cout<<endl<<"Результирующий массив: ";
for (i=0; i<n; i++) //вывод массива
cout<<mas[i]<<" ";
}`];

var Quiz_1 = new Quiz({
    Object: document.getElementById("quiz_1"),
    Type: "Column",
    Title: "Перетащить блоки так чтобы получился рабочий код программы",
    Data: DataArray_1,
    Code: true,
    Tags: ["C++", "Программирование", "Сортировка"]
});

// -----------------------------------------------------------------------------------------

var DataArray_2 = `int sort_bin (int* data, int size) 
{
        int i;
        for (i = 0; i < size; i++) {
                int pos = -1;
                int start = 0;
                int end = i - 1;
                int numToInsert = data[i];
                // Находим место вставки с помощью бинарного поиска
                while (start <= end && !(pos != -1)) {
                        int middle = (start + end) / 2;
                        if (numToInsert > data[middle]) {
                                start = middle + 1;
                        } else if (numToInsert < data[middle]) {
                                end = middle - 1;
                        } else {
                                pos = middle;
                        }
                }
                if(end < 0){
                        // определяем позицию в случае если элемент меньше всех отсортированных
                        pos = 0;
                } else if(start >= i){
                        // определяем позицию в случае если элемент больше всех отсортированных
                        pos = i;
                }
                if (pos < i) {
                        // сдвигаем элементы вправо на одну позицию
                        int j;
                        for (j = i; j > pos; j--) {
                                data[j] = data[j - 1];
                        }
                        data[pos] = numToInsert;
                }
        }
        return *data;
}`;

var Quiz_2 = new Quiz({
    Object: document.getElementById("quiz_2"),
    Title: "Перетащить блоки так чтобы получился рабочий код программы",
    Data: DataArray_2,
    Split: 6,
    Shuffle: false,
    Code: true,
    Tooltip: true,
    Tags: ["C++", "Программирование", "Сортировка"]
});

// -----------------------------------------------------------------------------------------

var DataArray_3 = [
    ["w_0", "w_7", "w_7", "w_6"],
    ["NULL", "l_0 DROP", "w_1", "r_0 DROP"],
    ["NULL", "r_0 DROP", "r_0 DROP", "c_0"],
    ["w_0", "w_8", "w_8", "w_5"]
];

var Quiz_3 = new Quiz({
    Object: document.getElementById("quiz_3"),
    Type: "Matrix",
    Title: "Перетащить блоки так чтобы получился рабочий код программы",
    Data: DataArray_3,
    Size: 128,
    Tags: ["Электротехника", "Переменный ток"]
});

// -----------------------------------------------------------------------------------------

var DataArray = [
    [`606e2ce9567cc.png DROP`, `606e2ce958792.png`, `606e2ce95b43a.png DROP`, `606e2ce95e318.png DROP`],
    [`606e2ce961620.png`, `606e2ce96766a.png`, `606e2ce969c0c.png DROP`, `606e2ce96c7a5.png DROP`],
    [`606e2ce96efde.png`, `606e2ce9714aa.png`, `606e2ce973956.png`, `606e2ce975da5.png`]
];


var Quiz_4 = new Quiz({
    Object: document.getElementById("quiz_4"),
    Type: "Matrix",
    ImgSrc: "img/constructor/result/606e2ce94b53c/",
    Title: "Перетащить блоки так чтобы получился рабочий код программы",
    Data: DataArray,
    Tags: ["Halo", "Meme"]
});

new Tooltip();

// ----------------------------------------- Проверка ---------------------------------------

Quiz_1.submitButton.addEventListener("click", e => {
    console.log(Quiz_1.getResult(DataArray_1));
});

Quiz_2.submitButton.addEventListener("click", e => {
    console.log(Quiz_2.getResult(DataArray_2));
});

Quiz_3.submitButton.addEventListener("click", e => {
    console.log(Quiz_3.getResult(DataArray_3));
});

Quiz_4.submitButton.addEventListener("click", e => {
    console.log(Quiz_4.getResult(DataArray));
});
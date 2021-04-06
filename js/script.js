new Quiz({
    Object: document.getElementById("quiz_1"),
    Type: "Column",
    Title: "Перетащить блоки так чтобы получился рабочий код программы",
    Data: [`int i, j, key=0, temp=0;
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
    }`],
    Tags: ["C++", "Программирование", "Сортировка"]
});

new Quiz({
    Object: document.getElementById("quiz_3"),
    Title: "Перетащить блоки так чтобы получился рабочий код программы",
    Data: `int sort_bin (int* data, int size) 
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
    }`,
    Split: 10,
    Shuffle: true,
    Tags: ["C++", "Программирование", "Сортировка"]
});

new Quiz({
    Object: document.getElementById("quiz_2"),
    Type: "Matrix",
    Title: "Перетащить блоки так чтобы получился рабочий код программы",
    Data: [
        ["w_0", "w_7", "w_7", "w_6"],
        ["NULL", "l_0 DROP", "w_1", "r_0 DROP"],
        ["NULL", "r_0 DROP", "r_0 DROP", "c_0"],
        ["w_0", "w_8", "w_8", "w_5"]
    ],
    Size: 128,
    Tags: ["Электротехника", "Переменный ток"]
});

new Tooltip();
var title_1 = "Перетащить блоки так чтобы получился рабочий код программы";
var questions = [`int i, j, key=0, temp=0;
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
var tags_1 = ["C++", "Программирование", "Сортировка"];
var object_1 = document.getElementById("quiz_1");

new QuizColumn(object_1, title_1, questions, tags_1);

var title_2 = "Собрать цепь переменного тока при последовательном соединении элементов";
var matrix = [
    ["w_0", "w_7", "w_7", "w_6"],
    ["NULL", "DROP", "w_1", "DROP"],
    ["NULL", "DROP", "DROP", "c_0"],
    ["w_0", "w_8", "w_8", "w_5"]
];
var storage = ["r_0", "r_0", "r_0", "l_0"];

var tags_2 = ["Электротехника", "Переменный ток"];
var object_2 = document.getElementById("quiz_2");

new QuizMatrix(object_2, title_2, matrix, storage, tags_2);

new Tooltip();
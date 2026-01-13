app.service('EmployeeService', function ($http) {

  const API = 'http://localhost:3000/api/employees';

  this.getAll = () => $http.get(API);

  this.create = (data) => $http.post(API, data);

  this.update = (id, data) => $http.put(`${API}/${id}`, data);

  this.delete = (id) => $http.delete(`${API}/${id}`);
});

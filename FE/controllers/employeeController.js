app.controller('EmployeeController', function ($scope, EmployeeService) {

  $scope.employees = [];
  $scope.showModal = false;
  $scope.isEdit = false;
  $scope.form = {};
  $scope.loading = false;

  function loadEmployees() {
    EmployeeService.getAll()
      .then(res => {
        $scope.employees = res.data;
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to load employees', 'error');
      });
  }

  loadEmployees();

  $scope.openAdd = function () {
    $scope.isEdit = false;
    $scope.form = {};
    $scope.showModal = true;
  };

  $scope.openEdit = function (emp) {
    $scope.isEdit = true;
    $scope.form = {
      id: emp.EmployeeID,
      name: emp.Name,
      position: emp.Position,
      salary: emp.Salary
    };
    $scope.showModal = true;
  };

  $scope.close = function () {
    $scope.showModal = false;
    $scope.form = {};
  };

  $scope.save = function () {
    $scope.loading = true;

    const request = $scope.isEdit
      ? EmployeeService.update($scope.form.id, $scope.form)
      : EmployeeService.create($scope.form);

    request
      .then(res => {
        Swal.fire('Success', res.data.message, 'success');
        $scope.close();
        loadEmployees();
      })
      .catch(err => {
        const msg =
          err.data?.warning ||
          err.data?.error ||
          'Unexpected error occurred';

        Swal.fire('Failed', msg, 'error');
      })
      .finally(() => {
        $scope.loading = false;
      });
  };

  $scope.delete = function (id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This employee will be deleted',
      icon: 'warning',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        EmployeeService.delete(id)
          .then(res => {
            Swal.fire('Deleted', res.data.message, 'success');
            loadEmployees();
          })
          .catch(err => {
            Swal.fire(
              'Failed',
              err.data?.error || 'Employee not found',
              'error'
            );
          });
      }
    });
  };
});

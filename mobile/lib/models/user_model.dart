/// Optional frontend data model. Does not alter existing API behavior.
class UserModel {
  final String id;
  final String firstName;
  final String lastName;
  final String email;

  const UserModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
  });
}
